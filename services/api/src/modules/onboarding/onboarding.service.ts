import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import {
  ResourceNotFoundException,
  ResourceForbiddenException,
  MaxProfilesException,
  CannotDeletePrimaryException,
} from '@/common/exceptions';

// OB-001 through OB-012 — Full Onboarding Service

interface QuizData {
  regions?: string[];
  spiceLevel?: number;
  sweetLevel?: number;
  saltLevel?: number;
  allergens?: string[];
  customAllergens?: string[];
  dietType?: string;
  maxCookTime?: string;
  familySize?: number;
}

@Injectable()
export class OnboardingService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // ---- OB-001: Quiz Submit ----
  async submitQuiz(userId: string, data: QuizData) {
    // Create primary taste profile from quiz data
    const profile = await this.prisma.tasteProfile.create({
      data: {
        userId,
        profileName: 'Tôi',
        isPrimary: true,
        regions: data.regions || [],
        spiceLevel: data.spiceLevel ?? 3,
        sweetLevel: data.sweetLevel ?? 3,
        saltLevel: data.saltLevel ?? 3,
        dietType: (data.dietType as any) || 'normal',
        maxCookTime: (data.maxCookTime as any) || 'thirty_to_60',
        familySize: data.familySize ?? 2,
      },
    });

    // Create dietary restriction if allergens provided
    if (data.allergens?.length || data.customAllergens?.length) {
      await this.prisma.dietaryRestriction.create({
        data: {
          userId,
          profileId: profile.id,
          allergens: data.allergens || [],
          customBlacklist: data.customAllergens || [],
        },
      });
    }

    // Mark onboarding complete
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        activeProfileId: profile.id,
      },
    });

    // Clear quiz progress from Redis
    await this.redis.del(`quiz_progress:${userId}`);

    return profile;
  }

  // ---- OB-001: Get quiz progress ----
  async getQuizProgress(userId: string) {
    const progress = await this.redis.getJson<{
      completedSteps: number[];
      partialData: Record<string, unknown>;
    }>(`quiz_progress:${userId}`);

    return {
      completedSteps: progress?.completedSteps || [],
      totalSteps: 5,
      currentStep: (progress?.completedSteps?.length || 0) + 1,
      partialData: progress?.partialData || {},
    };
  }

  // ---- OB-010: Save quiz step (auto-save) ----
  async saveQuizStep(userId: string, step: number, data: Record<string, unknown>) {
    const key = `quiz_progress:${userId}`;
    const progress = (await this.redis.getJson<{
      completedSteps: number[];
      partialData: Record<string, unknown>;
    }>(key)) || { completedSteps: [], partialData: {} };

    if (!progress.completedSteps.includes(step)) {
      progress.completedSteps.push(step);
    }
    progress.partialData = { ...progress.partialData, ...data };

    await this.redis.setJson(key, progress, 86400); // 24h TTL

    return {
      completedSteps: progress.completedSteps,
      totalSteps: 5,
      currentStep: Math.min(progress.completedSteps.length + 1, 5),
      partialData: progress.partialData,
    };
  }

  // ---- OB-001: Skip quiz ----
  async skipQuiz(userId: string) {
    // BR-OB-01: Create default profile with medium tastes
    const profile = await this.prisma.tasteProfile.create({
      data: {
        userId,
        profileName: 'Tôi',
        isPrimary: true,
        regions: [],
        spiceLevel: 3,
        sweetLevel: 3,
        saltLevel: 3,
        dietType: 'normal',
        maxCookTime: 'thirty_to_60',
        familySize: 2,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        activeProfileId: profile.id,
      },
    });

    return profile;
  }

  // ---- OB-002: Taste Profile CRUD ----
  async getTasteProfiles(userId: string) {
    return this.prisma.tasteProfile.findMany({
      where: { userId },
      include: { dietaryRestrictions: true },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async getTasteProfile(userId: string, profileId: string) {
    const profile = await this.prisma.tasteProfile.findFirst({
      where: { id: profileId, userId },
      include: { dietaryRestrictions: true },
    });
    if (!profile) throw new ResourceNotFoundException('Taste profile');
    return profile;
  }

  async updateTasteProfile(userId: string, profileId: string, data: Partial<QuizData>) {
    const profile = await this.prisma.tasteProfile.findFirst({
      where: { id: profileId, userId },
    });
    if (!profile) throw new ResourceNotFoundException('Taste profile');

    return this.prisma.tasteProfile.update({
      where: { id: profileId },
      data: {
        ...(data.regions !== undefined && { regions: data.regions }),
        ...(data.spiceLevel !== undefined && { spiceLevel: data.spiceLevel }),
        ...(data.sweetLevel !== undefined && { sweetLevel: data.sweetLevel }),
        ...(data.saltLevel !== undefined && { saltLevel: data.saltLevel }),
        ...(data.dietType !== undefined && { dietType: data.dietType as any }),
        ...(data.maxCookTime !== undefined && { maxCookTime: data.maxCookTime as any }),
        ...(data.familySize !== undefined && { familySize: data.familySize }),
      },
      include: { dietaryRestrictions: true },
    });
  }

  // ---- OB-004: Family Profiles ----
  async getFamilyProfiles(userId: string) {
    return this.prisma.tasteProfile.findMany({
      where: { userId },
      include: { dietaryRestrictions: true },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async createFamilyProfile(userId: string, data: {
    name: string;
    ageRange?: string;
    tasteProfile?: QuizData;
  }) {
    // Check limit: BR-OB-05
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const count = await this.prisma.tasteProfile.count({ where: { userId } });
    const maxProfiles = user?.subscriptionTier === 'pro' ? 10 : 6;

    if (count >= maxProfiles) throw new MaxProfilesException(maxProfiles);

    // BR-OB-02: Inherit from primary if not provided
    const primary = await this.prisma.tasteProfile.findFirst({
      where: { userId, isPrimary: true },
    });

    const tp = data.tasteProfile || {};

    const profile = await this.prisma.tasteProfile.create({
      data: {
        userId,
        profileName: data.name,
        isPrimary: false,
        ageRange: (data.ageRange as any) || null,
        regions: tp.regions || primary?.regions || [],
        spiceLevel: tp.spiceLevel ?? primary?.spiceLevel ?? 3,
        sweetLevel: tp.sweetLevel ?? primary?.sweetLevel ?? 3,
        saltLevel: tp.saltLevel ?? primary?.saltLevel ?? 3,
        dietType: (tp.dietType as any) || primary?.dietType || 'normal',
        maxCookTime: (tp.maxCookTime as any) || primary?.maxCookTime || 'thirty_to_60',
        familySize: tp.familySize ?? primary?.familySize ?? 2,
      },
      include: { dietaryRestrictions: true },
    });

    // BR-OB-06: Child auto-filter
    if (data.ageRange === 'child_under_6' || data.ageRange === 'child_6_12') {
      await this.applyChildFilter(userId, profile.id);
    }

    return profile;
  }

  async updateFamilyProfile(userId: string, profileId: string, data: {
    name?: string;
    ageRange?: string;
    tasteProfile?: Partial<QuizData>;
  }) {
    const profile = await this.prisma.tasteProfile.findFirst({
      where: { id: profileId, userId },
    });
    if (!profile) throw new ResourceNotFoundException('Family profile');

    return this.prisma.tasteProfile.update({
      where: { id: profileId },
      data: {
        ...(data.name !== undefined && { profileName: data.name }),
        ...(data.ageRange !== undefined && { ageRange: data.ageRange as any }),
        ...(data.tasteProfile?.regions !== undefined && { regions: data.tasteProfile.regions }),
        ...(data.tasteProfile?.spiceLevel !== undefined && { spiceLevel: data.tasteProfile.spiceLevel }),
        ...(data.tasteProfile?.sweetLevel !== undefined && { sweetLevel: data.tasteProfile.sweetLevel }),
        ...(data.tasteProfile?.saltLevel !== undefined && { saltLevel: data.tasteProfile.saltLevel }),
        ...(data.tasteProfile?.dietType !== undefined && { dietType: data.tasteProfile.dietType as any }),
        ...(data.tasteProfile?.maxCookTime !== undefined && { maxCookTime: data.tasteProfile.maxCookTime as any }),
        ...(data.tasteProfile?.familySize !== undefined && { familySize: data.tasteProfile.familySize }),
      },
      include: { dietaryRestrictions: true },
    });
  }

  async deleteFamilyProfile(userId: string, profileId: string) {
    const profile = await this.prisma.tasteProfile.findFirst({
      where: { id: profileId, userId },
    });
    if (!profile) throw new ResourceNotFoundException('Family profile');
    if (profile.isPrimary) throw new CannotDeletePrimaryException();

    await this.prisma.tasteProfile.delete({ where: { id: profileId } });
  }

  async setActiveProfile(userId: string, profileId: string | null) {
    if (profileId) {
      const profile = await this.prisma.tasteProfile.findFirst({
        where: { id: profileId, userId },
      });
      if (!profile) throw new ResourceNotFoundException('Profile');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { activeProfileId: profileId },
    });

    return {
      activeProfileId: profileId,
      mode: profileId ? 'individual' : 'family',
    };
  }

  // ---- OB-011: Merge preferences (family mode) ----
  async getMergedPreferences(userId: string) {
    const profiles = await this.prisma.tasteProfile.findMany({
      where: { userId },
      include: { dietaryRestrictions: true },
    });

    if (profiles.length === 0) throw new ResourceNotFoundException('Profiles');
    if (profiles.length === 1) return profiles[0];

    // BR-OB-03: Merge
    const allRegions = [...new Set(profiles.flatMap((p: any) => p.regions))];

    // Average taste levels
    const avgSpice = Math.round(profiles.reduce((s: number, p: any) => s + p.spiceLevel, 0) / profiles.length);
    const avgSweet = Math.round(profiles.reduce((s: number, p: any) => s + p.sweetLevel, 0) / profiles.length);
    const avgSalt = Math.round(profiles.reduce((s: number, p: any) => s + p.saltLevel, 0) / profiles.length);

    // Union allergens
    const allAllergens = [...new Set(profiles.flatMap((p: any) =>
      p.dietaryRestrictions.flatMap((dr: any) => dr.allergens),
    ))];

    // Strictest diet type
    const dietPriority: Record<string, number> = {
      vegan: 6, lacto_ovo_vegetarian: 5, paleo: 4, keto: 3, low_carb: 2, normal: 1,
    };
    const strictestDiet = profiles.reduce((strictest: string, p: any) => {
      return (dietPriority[p.dietType] || 0) > (dietPriority[strictest] || 0)
        ? p.dietType
        : strictest;
    }, 'normal');

    // Min cook time
    const cookTimePriority: Record<string, number> = {
      under_15: 1, fifteen_to_30: 2, thirty_to_60: 3, over_60: 4,
    };
    const minCookTime = profiles.reduce((min: string, p: any) => {
      return (cookTimePriority[p.maxCookTime] || 99) < (cookTimePriority[min] || 99)
        ? p.maxCookTime
        : min;
    }, profiles[0].maxCookTime);

    return {
      id: 'merged',
      userId,
      profileName: 'Cả gia đình',
      isPrimary: false,
      regions: allRegions,
      spiceLevel: avgSpice,
      sweetLevel: avgSweet,
      saltLevel: avgSalt,
      dietType: strictestDiet,
      maxCookTime: minCookTime,
      familySize: profiles.reduce((sum: number, p: any) => sum + p.familySize, 0),
      allergens: allAllergens,
    };
  }

  // ---- OB-012: Child profile auto-filter ----
  private async applyChildFilter(userId: string, profileId: string) {
    // Auto-create dietary restriction: no spicy (spice=1), no raw, no caffeine
    await this.prisma.tasteProfile.update({
      where: { id: profileId },
      data: { spiceLevel: 1 },
    });

    const existing = await this.prisma.dietaryRestriction.findFirst({
      where: { profileId },
    });

    if (existing) {
      await this.prisma.dietaryRestriction.update({
        where: { id: existing.id },
        data: {
          customBlacklist: {
            push: ['đồ sống', 'cà phê', 'trà đặc', 'bia', 'rượu'],
          },
        },
      });
    } else {
      await this.prisma.dietaryRestriction.create({
        data: {
          userId,
          profileId,
          customBlacklist: ['đồ sống', 'cà phê', 'trà đặc', 'bia', 'rượu'],
        },
      });
    }
  }
}
