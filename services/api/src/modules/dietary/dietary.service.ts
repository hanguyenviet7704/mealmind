import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ResourceNotFoundException, ResourceForbiddenException } from '@/common/exceptions';

// Master data constants matching docs/data/master-data.md
const DIET_TYPES = [
  { key: 'normal', label: 'Bình thường', description: 'Không giới hạn', phase: 'mvp' },
  { key: 'lacto_ovo_vegetarian', label: 'Chay (trứng + sữa)', description: 'Không thịt, không cá, OK trứng + sữa', phase: 'mvp' },
  { key: 'vegan', label: 'Thuần chay', description: 'Không sản phẩm động vật', phase: 'mvp' },
  { key: 'keto', label: 'Keto', description: '< 20g carb/ngày, high fat', phase: 'mvp' },
  { key: 'low_carb', label: 'Low-carb', description: '< 100g carb/ngày', phase: 'mvp' },
  { key: 'paleo', label: 'Paleo', description: 'Không ngũ cốc, không sữa, không đậu', phase: 'mvp' },
];

const ALLERGENS = [
  { key: 'shellfish', label: 'Hải sản có vỏ', description: 'Tôm, cua, ghẹ, sò, hàu, ốc', phase: 'mvp' },
  { key: 'fish', label: 'Cá', description: 'Cá các loại, nước mắm', phase: 'mvp' },
  { key: 'peanuts', label: 'Đậu phộng', description: 'Đậu phộng, bơ đậu phộng', phase: 'mvp' },
  { key: 'gluten', label: 'Gluten', description: 'Lúa mì, lúa mạch, yến mạch, mì', phase: 'mvp' },
  { key: 'dairy', label: 'Sữa', description: 'Sữa, phô mai, bơ, kem, sữa chua', phase: 'mvp' },
  { key: 'eggs', label: 'Trứng', description: 'Trứng gà, trứng vịt, trứng cút', phase: 'mvp' },
  { key: 'soy', label: 'Đậu nành', description: 'Đậu nành, đậu hũ, tương, nước tương', phase: 'mvp' },
  { key: 'tree_nuts', label: 'Hạt cây', description: 'Hạnh nhân, óc chó, hạt điều, hạt macca', phase: 'mvp' },
];

const MEDICAL_CONDITIONS = [
  { key: 'diabetes', label: 'Tiểu đường', description: 'Loại GI cao, đường cao', phase: 'phase2' },
  { key: 'hypertension', label: 'Huyết áp cao', description: 'Loại sodium > 600mg/serving', phase: 'phase2' },
  { key: 'gout', label: 'Gout', description: 'Loại purine_level = high', phase: 'phase2' },
  { key: 'kidney', label: 'Bệnh thận', description: 'Loại protein > 25g/serving', phase: 'phase2' },
];

const RELIGIOUS_DIETS = [
  { key: 'none', label: 'Không', description: 'Mặc định', phase: 'mvp' },
  { key: 'buddhist_lunar', label: 'Chay Phật giáo', description: 'Ăn chay ngày rằm + mùng 1', phase: 'mvp' },
  { key: 'halal', label: 'Halal', description: 'Không thịt heo, không rượu', phase: 'mvp' },
  { key: 'kosher', label: 'Kosher', description: 'Tách meat/dairy, không shellfish', phase: 'mvp' },
];

@Injectable()
export class DietaryService {
  constructor(private prisma: PrismaService) {}

  // DF-001: Get dietary restrictions
  async getDietaryRestrictions(userId: string, requesterId: string, profileId?: string) {
    // Only allow viewing own data
    if (userId !== requesterId) throw new ResourceForbiddenException();

    const where: any = { userId };
    if (profileId) where.profileId = profileId;

    const restriction = await this.prisma.dietaryRestriction.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (!restriction) {
      // Return default
      return {
        id: null,
        userId,
        profileId: profileId || null,
        dietType: 'normal',
        allergens: [],
        medicalConditions: [],
        religiousDiet: 'none',
        ingredientBlacklist: [],
        createdAt: null,
        updatedAt: null,
      };
    }

    return restriction;
  }

  // DF-001: Update dietary restrictions (PUT semantics)
  async updateDietaryRestrictions(userId: string, requesterId: string, data: {
    profileId?: string;
    dietType?: string;
    allergens?: string[];
    medicalConditions?: string[];
    religiousDiet?: string;
    ingredientBlacklist?: string[];
  }) {
    if (userId !== requesterId) throw new ResourceForbiddenException();

    // Get or create profileId
    let profileId = data.profileId;
    if (!profileId) {
      const primaryProfile = await this.prisma.tasteProfile.findFirst({
        where: { userId, isPrimary: true },
      });
      profileId = primaryProfile?.id;
    }

    // Upsert
    const existing = await this.prisma.dietaryRestriction.findFirst({
      where: { userId, profileId: profileId || undefined },
    });

    if (existing) {
      return this.prisma.dietaryRestriction.update({
        where: { id: existing.id },
        data: {
          ...(data.dietType && { dietType: data.dietType as any }),
          ...(data.allergens && { allergens: data.allergens }),
          ...(data.religiousDiet && { religiousDiet: data.religiousDiet as any }),
          ...(data.ingredientBlacklist && { customBlacklist: data.ingredientBlacklist }),
        },
      });
    }

    return this.prisma.dietaryRestriction.create({
      data: {
        userId,
        profileId: profileId!, // ensured by upsert logic above
        allergens: data.allergens || [],
        religiousDiet: (data.religiousDiet as any) || 'none',
        customBlacklist: data.ingredientBlacklist || [],
      },
    });
  }

  // DF-002: Get dietary options (master data)
  getDietaryOptions() {
    return {
      dietTypes: DIET_TYPES.map((d) => ({ ...d, category: 'diet_type', iconUrl: null })),
      allergens: ALLERGENS.map((a) => ({ ...a, category: 'allergen', iconUrl: null })),
      medicalConditions: MEDICAL_CONDITIONS.map((m) => ({ ...m, category: 'medical_condition', iconUrl: null })),
      religiousDiets: RELIGIOUS_DIETS.map((r) => ({ ...r, category: 'religious_diet', iconUrl: null })),
    };
  }

  // DF-003: Filter logic for recommendation pipeline
  async getFilterCriteria(userId: string, profileId?: string) {
    const restriction = await this.prisma.dietaryRestriction.findFirst({
      where: { userId, ...(profileId ? { profileId } : {}) },
    });

    if (!restriction) return { excludeAllergens: [], excludeIngredients: [], dietType: 'normal' };

    return {
      excludeAllergens: restriction.allergens || [],
      excludeIngredients: restriction.customBlacklist || [],
      dietType: 'normal', // dietType is on TasteProfile, not DietaryRestriction
    };
  }

  // DF-004: Build Prisma WHERE for recipe search with dietary filters
  buildDietaryFilter(dietType: string, allergens: string[], blacklist: string[]) {
    const conditions: any[] = [];

    // Diet type filter
    if (dietType === 'vegan') {
      conditions.push({ tags: { has: 'vegan' } });
    } else if (dietType === 'lacto_ovo_vegetarian') {
      conditions.push({ tags: { hasSome: ['vegetarian', 'vegan'] } });
    } else if (dietType === 'keto') {
      conditions.push({
        nutritionInfo: { carbs: { lte: 20 } },
      });
    }

    // Allergen exclusion — recipes with these allergen tags should be excluded
    if (allergens.length > 0) {
      conditions.push({
        NOT: {
          allergenTags: { hasSome: allergens },
        },
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  }
}
