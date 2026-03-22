import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  ResourceNotFoundException,
  ResourceForbiddenException,
  PlanLimitException,
  LockLimitException,
  CannotDeleteActivePlanException,
} from '@/common/exceptions';
import { paginate } from '@/common/dto/pagination.dto';

@Injectable()
export class MealPlansService {
  private readonly logger = new Logger(MealPlansService.name);
  private readonly recommendationUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.recommendationUrl = this.config.get('RECOMMENDATION_SERVICE_URL', 'http://localhost:8000');
  }

  // MP-001: Create meal plan (generate 21 slots: 7 days × 3 meals)
  async createMealPlan(userId: string, params: {
    profileId?: string;
    weekStart?: string;
    lockedSlots?: Array<{ day: number; mealType: string; recipeId: string }>;
  }) {
    // Check draft limit
    const draftCount = await this.prisma.mealPlan.count({
      where: { userId, status: 'draft' as any },
    });
    if (draftCount >= 3) throw new PlanLimitException(3);

    const weekStart = params.weekStart
      ? new Date(params.weekStart)
      : this.getNextMonday();

    // Try calling recommendation service
    let slots: Array<{ day: number; mealType: string; recipeId: string; isLocked: boolean }> = [];

    try {
      const allRecipes = await this.prisma.recipe.findMany({
        where: { isPublished: true },
        select: { id: true, name: true, mealTypes: true, nutritionInfo: { select: { calories: true } } },
      });
      const minimalRecipes = allRecipes.map((r: any) => ({
        id: r.id, name: r.name, mealTypes: r.mealTypes, calories: r.nutritionInfo?.calories ? Number(r.nutritionInfo.calories) : null
      }));

      const body = {
        available_recipes: minimalRecipes,
        days: 7,
        meals_per_day: 3,
        userId,
        weekStart: weekStart.toISOString().split('T')[0],
        lockedSlots: params.lockedSlots || [],
      };

      const response = await fetch(`${this.recommendationUrl}/api/v1/recommend/meal-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000), // 15s for plan generation
      });

      if (response.ok) {
        const data = await response.json();
        const planIds = data.plan || [];
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        
        let idIndex = 0;
        for (let day = 1; day <= 7; day++) {
          for (const mType of mealTypes) {
            // Find if there's a locked slot for this day/mType
            const locked = params.lockedSlots?.find(l => l.day === day && l.mealType === mType);
            if (locked) {
              slots.push({ day, mealType: mType, recipeId: locked.recipeId, isLocked: true });
            } else if (idIndex < planIds.length) {
              slots.push({ day, mealType: mType, recipeId: planIds[idIndex], isLocked: false });
              idIndex++;
            }
          }
        }
      }
    } catch (e: any) {
      this.logger.warn(`Recommendation service unavailable for meal plan, using popularity fallback: ${e.message}`);
    }

    // Fallback: fill with popular recipes
    if (slots.length === 0) {
      slots = await this.generateFallbackSlots(userId, params.lockedSlots || []);
    }

    // Create meal plan with items
    const mealPlan = await this.prisma.mealPlan.create({
      data: {
        userId,
        weekStart,
        status: 'draft',
        items: {
          create: slots.map((s: any) => ({
            day: s.day,
            mealType: s.mealType as any,
            recipeId: s.recipeId,
            isLocked: s.isLocked || false,
          })),
        },
      },
      include: {
        items: {
          include: {
            recipe: { select: { id: true, name: true, imageUrl: true, cookTime: true } },
          },
          orderBy: [{ day: 'asc' }, { mealType: 'asc' }],
        },
      },
    });

    return mealPlan;
  }

  // MP-003: CRUD
  async listMealPlans(userId: string, params: {
    status?: string; page?: number; pageSize?: number;
  }) {
    const { status, page = 1, pageSize = 10 } = params;

    const where: any = { userId };
    if (status) where.status = status;

    const [plans, total] = await Promise.all([
      this.prisma.mealPlan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { items: true } },
        },
      }),
      this.prisma.mealPlan.count({ where }),
    ]);

    return paginate(plans, total, page, pageSize);
  }

  async getMealPlan(userId: string, planId: string) {
    const plan = await this.prisma.mealPlan.findFirst({
      where: { id: planId, userId },
      include: {
        items: {
          include: {
            recipe: {
              include: { nutritionInfo: true },
            },
          },
          orderBy: [{ day: 'asc' }],
        },
      },
    });
    if (!plan) throw new ResourceNotFoundException('Meal plan');
    return plan;
  }

  async updateMealPlanStatus(userId: string, planId: string, status: string) {
    const plan = await this.prisma.mealPlan.findFirst({ where: { id: planId, userId } });
    if (!plan) throw new ResourceNotFoundException('Meal plan');

    // If activating, archive other active plans
    if (status === ('active' as any)) {
      await this.prisma.mealPlan.updateMany({
        where: { userId, status: 'active' as any, id: { not: planId } },
        data: { status: 'archived' as any },
      });
    }

    return this.prisma.mealPlan.update({
      where: { id: planId },
      data: { status: status as any },
    });
  }

  // MP-004: Swap recipe in slot
  async swapSlotRecipe(userId: string, planId: string, slotId: string, newRecipeId: string) {
    const plan = await this.prisma.mealPlan.findFirst({ where: { id: planId, userId } });
    if (!plan) throw new ResourceNotFoundException('Meal plan');

    const slot = await this.prisma.mealPlanItem.findFirst({
      where: { id: slotId, planId },
    });
    if (!slot) throw new ResourceNotFoundException('Slot');

    return this.prisma.mealPlanItem.update({
      where: { id: slotId },
      data: { recipeId: newRecipeId },
      include: {
        recipe: { select: { id: true, name: true, imageUrl: true } },
      },
    });
  }

  // MP-004: Lock/unlock slot
  async toggleSlotLock(userId: string, planId: string, slotId: string, isLocked: boolean) {
    const plan = await this.prisma.mealPlan.findFirst({ where: { id: planId, userId } });
    if (!plan) throw new ResourceNotFoundException('Meal plan');

    // Check 70% lock limit
    if (isLocked) {
      const totalSlots = await this.prisma.mealPlanItem.count({ where: { planId } });
      const lockedSlots = await this.prisma.mealPlanItem.count({ where: { planId, isLocked: true } });
      if ((lockedSlots + 1) / totalSlots > 0.7) throw new LockLimitException();
    }

    return this.prisma.mealPlanItem.update({
      where: { id: slotId },
      data: { isLocked },
    });
  }

  // MP-005: Get alternative recipes for a slot
  async getSlotSuggestions(userId: string, planId: string, slotId: string) {
    const slot = await this.prisma.mealPlanItem.findFirst({
      where: { id: slotId, planId },
    });
    if (!slot) throw new ResourceNotFoundException('Slot');

    // Get other recipe IDs in this plan to exclude
    const otherSlots = await this.prisma.mealPlanItem.findMany({
      where: { planId, id: { not: slotId } },
      select: { recipeId: true },
    });
    const excludeIds = otherSlots.map((s: any) => s.recipeId);

    const alternatives = await this.prisma.recipe.findMany({
      where: {
        isPublished: true,
        id: { notIn: excludeIds },
        mealTypes: { array_contains: slot.mealType },
      },
      orderBy: { popularityScore: 'desc' },
      take: 5,
      include: { nutritionInfo: true },
    });

    return alternatives;
  }

  // MP-006: Regenerate unlocked slots
  async regenerate(userId: string, planId: string) {
    const plan = await this.prisma.mealPlan.findFirst({
      where: { id: planId, userId },
      include: { items: true },
    });
    if (!plan) throw new ResourceNotFoundException('Meal plan');

    const unlockedSlots = plan.items.filter((s: any) => !s.isLocked);
    const lockedRecipeIds = plan.items.filter((s: any) => s.isLocked).map((s: any) => s.recipeId);

    // Get new recipes for unlocked slots
    for (const slot of unlockedSlots) {
      const newRecipe = await this.prisma.recipe.findFirst({
        where: {
          isPublished: true,
          id: { notIn: lockedRecipeIds },
          mealTypes: { array_contains: slot.mealType },
        },
        orderBy: { popularityScore: 'desc' },
        skip: Math.floor(Math.random() * 10), // Add randomness
      });

      if (newRecipe) {
        await this.prisma.mealPlanItem.update({
          where: { id: slot.id },
          data: { recipeId: newRecipe.id },
        });
        lockedRecipeIds.push(newRecipe.id); // Avoid duplicates
      }
    }

    return this.getMealPlan(userId, planId);
  }

  // MP-007: Share meal plan
  async shareMealPlan(userId: string, planId: string, shareWith: {
    userId: string; role: string;
  }) {
    const plan = await this.prisma.mealPlan.findFirst({ where: { id: planId, userId } });
    if (!plan) throw new ResourceNotFoundException('Meal plan');

    return this.prisma.mealPlanShare.create({
      data: {
        planId,
        ownerId: userId,
        sharedWithId: shareWith.userId,
        permission: shareWith.role as any,
      },
    });
  }

  // G4: Delete meal plan (only draft or archived)
  async deleteMealPlan(userId: string, planId: string) {
    const plan = await this.prisma.mealPlan.findFirst({ where: { id: planId, userId } });
    if (!plan) throw new ResourceNotFoundException('Meal plan');
    if (plan.status === ('active' as any)) throw new CannotDeleteActivePlanException();

    await this.prisma.mealPlan.delete({ where: { id: planId } });
  }

  // G17: Revoke share
  async revokeShare(userId: string, planId: string, shareId: string) {
    const plan = await this.prisma.mealPlan.findFirst({ where: { id: planId, userId } });
    if (!plan) throw new ResourceNotFoundException('Meal plan');

    const share = await this.prisma.mealPlanShare.findFirst({
      where: { id: shareId, planId },
    });
    if (!share) throw new ResourceNotFoundException('Share');

    await this.prisma.mealPlanShare.delete({ where: { id: shareId } });
  }

  // G18: List shares
  async listShares(userId: string, planId: string) {
    const plan = await this.prisma.mealPlan.findFirst({ where: { id: planId, userId } });
    if (!plan) throw new ResourceNotFoundException('Meal plan');

    return this.prisma.mealPlanShare.findMany({
      where: { planId },
      include: {
        sharedWith: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });
  }

  // ---- Helpers ----
  private getNextMonday(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 1 : 8 - day;
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + diff);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  }

  private async generateFallbackSlots(userId: string, lockedSlots: Array<{ day: number; mealType: string; recipeId: string }>) {
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const slots: Array<{ day: number; mealType: string; recipeId: string; isLocked: boolean }> = [];

    // Add locked slots first
    for (const locked of lockedSlots) {
      slots.push({ ...locked, isLocked: true });
    }

    // Fill remaining 21 slots
    for (let day = 1; day <= 7; day++) {
      for (const mealType of mealTypes) {
        const existing = slots.find((s) => s.day === day && s.mealType === mealType);
        if (existing) continue;

        const usedIds = slots.map((s: any) => s.recipeId);
        const recipe = await this.prisma.recipe.findFirst({
          where: {
            isPublished: true,
            mealTypes: { array_contains: mealType },
            id: { notIn: usedIds },
          },
          orderBy: { popularityScore: 'desc' },
          skip: Math.floor(Math.random() * 5),
        });

        if (recipe) {
          slots.push({ day, mealType, recipeId: recipe.id, isLocked: false });
        }
      }
    }

    return slots;
  }
}
