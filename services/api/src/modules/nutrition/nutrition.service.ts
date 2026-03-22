import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ResourceNotFoundException } from '@/common/exceptions';

@Injectable()
export class NutritionService {
  constructor(private prisma: PrismaService) {}

  // NT-001: Get recipe nutrition (calc from ingredients)
  async getRecipeNutrition(recipeId: string, servings?: number) {
    let nutrition: any;

    const existing = await this.prisma.nutritionInfo.findUnique({
      where: { recipeId },
    });

    if (existing) {
      nutrition = {
        calories: Number(existing.calories),
        protein: Number(existing.protein),
        carbs: Number(existing.carbs),
        fat: Number(existing.fat),
        fiber: existing.fiber ? Number(existing.fiber) : null,
        sodium: existing.sodium ? Number(existing.sodium) : null,
      };
    } else {
      nutrition = await this.calculateFromIngredients(recipeId);
    }

    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { servings: true },
    });
    if (!recipe) throw new ResourceNotFoundException('Recipe');

    const requestedServings = servings || recipe.servings;
    const factor = requestedServings / recipe.servings;

    return {
      calories: Math.round(nutrition.calories * factor),
      protein: Math.round(nutrition.protein * factor * 10) / 10,
      carbs: Math.round(nutrition.carbs * factor * 10) / 10,
      fat: Math.round(nutrition.fat * factor * 10) / 10,
      fiber: nutrition.fiber ? Math.round(nutrition.fiber * factor * 10) / 10 : null,
      sodium: nutrition.sodium ? Math.round(nutrition.sodium * factor) : null,
      servings: requestedServings,
    };
  }

  // NT-002: Daily nutrition summary from active meal plan
  async getDailyNutrition(userId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();

    // Find active meal plan
    const activePlan = await this.prisma.mealPlan.findFirst({
      where: { userId, status: 'active' },
      include: {
        items: {
          include: {
            recipe: { include: { nutritionInfo: true } },
          },
        },
      },
    });

    if (!activePlan) {
      return {
        date: targetDate.toISOString().split('T')[0],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: [],
        goals: await this.getGoals(userId),
      };
    }

    // Calculate day of week (1=Monday)
    const dayOfWeek = targetDate.getDay() || 7; // Convert Sunday=0 to 7
    const daySlots = activePlan.items.filter((s: any) => s.day === dayOfWeek);

    const meals = daySlots.map((slot: any) => ({
      mealType: slot.mealType,
      recipe: slot.recipe
        ? { id: slot.recipe.id, name: slot.recipe.name, imageUrl: slot.recipe.imageUrl }
        : null,
      calories: slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.calories) : 0,
      protein: slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.protein) : 0,
      carbs: slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.carbs) : 0,
      fat: slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.fat) : 0,
    }));

    const totals = meals.reduce(
      (acc: any, m: any) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    return {
      date: targetDate.toISOString().split('T')[0],
      totalCalories: totals.calories,
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFat: Math.round(totals.fat * 10) / 10,
      meals,
      goals: await this.getGoals(userId),
    };
  }

  // NT-003: Weekly nutrition summary
  async getWeeklyNutrition(userId: string) {
    const activePlan = await this.prisma.mealPlan.findFirst({
      where: { userId, status: 'active' },
      include: {
        items: {
          include: {
            recipe: { include: { nutritionInfo: true } },
          },
        },
      },
    });

    if (!activePlan) {
      return { days: [], average: { calories: 0, protein: 0, carbs: 0, fat: 0 }, onTargetCount: 0 };
    }

    const days = [];
    for (let day = 1; day <= 7; day++) {
      const daySlots = activePlan.items.filter((s: any) => s.day === day);
      const totals = daySlots.reduce(
        (acc: any, slot: any) => ({
          calories: acc.calories + (slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.calories) : 0),
          protein: acc.protein + (slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.protein) : 0),
          carbs: acc.carbs + (slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.carbs) : 0),
          fat: acc.fat + (slot.recipe?.nutritionInfo ? Number(slot.recipe.nutritionInfo.fat) : 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );
      days.push({ day, ...totals });
    }

    const average = {
      calories: Math.round(days.reduce((s, d) => s + d.calories, 0) / 7),
      protein: Math.round(days.reduce((s, d) => s + d.protein, 0) / 7 * 10) / 10,
      carbs: Math.round(days.reduce((s, d) => s + d.carbs, 0) / 7 * 10) / 10,
      fat: Math.round(days.reduce((s, d) => s + d.fat, 0) / 7 * 10) / 10,
    };

    // Count days on-target (±10% of calorie goal)
    const goals = await this.getGoals(userId);
    const onTargetCount = days.filter((d) => {
      if (!goals.caloriesPerDay) return false;
      const diff = Math.abs(d.calories - goals.caloriesPerDay) / goals.caloriesPerDay;
      return diff <= 0.1;
    }).length;

    return { days, average, onTargetCount };
  }

  // NT-004: Nutrition goals
  async getGoals(userId: string) {
    const goals = await this.prisma.nutritionGoal.findFirst({
      where: { userId },
    });

    if (!goals) {
      // Default goals
      return {
        caloriesPerDay: 2000,
        proteinPerDay: 50,
        carbsPerDay: 275,
        fatPerDay: 65,
        preset: 'maintain',
      };
    }

    return {
      caloriesPerDay: goals.dailyCalories,
      proteinPerDay: Number(goals.dailyProteinGrams),
      carbsPerDay: Number(goals.dailyCarbGrams),
      fatPerDay: Number(goals.dailyFatGrams),
      preset: goals.preset,
    };
  }

  async updateGoals(userId: string, data: {
    caloriesPerDay?: number;
    proteinPerDay?: number;
    carbsPerDay?: number;
    fatPerDay?: number;
    preset?: string;
  }) {
    // Presets
    const presets: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
      maintain: { calories: 2000, protein: 120, carbs: 250, fat: 65 },
      loss: { calories: 1500, protein: 130, carbs: 150, fat: 50 },
      gain: { calories: 2500, protein: 150, carbs: 300, fat: 80 },
      diabetic: { calories: 1800, protein: 100, carbs: 180, fat: 60 },
    };

    let goalData: any = {};

    if (data.preset && presets[data.preset]) {
      const p = presets[data.preset];
      goalData = {
        dailyCalories: p.calories,
        dailyProteinGrams: p.protein,
        dailyCarbGrams: p.carbs,
        dailyFatGrams: p.fat,
        preset: data.preset as any,
      };
    } else {
      goalData = {
        ...(data.caloriesPerDay !== undefined && { dailyCalories: data.caloriesPerDay }),
        ...(data.proteinPerDay !== undefined && { dailyProteinGrams: data.proteinPerDay }),
        ...(data.carbsPerDay !== undefined && { dailyCarbGrams: data.carbsPerDay }),
        ...(data.fatPerDay !== undefined && { dailyFatGrams: data.fatPerDay }),
        preset: 'custom' as any,
      };
    }

    const existing = await this.prisma.nutritionGoal.findFirst({ where: { userId } });
    if (existing) {
      return this.prisma.nutritionGoal.update({
        where: { id: existing.id },
        data: goalData,
      });
    }

    return this.prisma.nutritionGoal.create({
      data: { userId, ...goalData },
    });
  }

  // ---- Helpers ----
  private async calculateFromIngredients(recipeId: string) {
    const recipeIngredients = await this.prisma.recipeIngredient.findMany({
      where: { recipeId },
      include: {
        ingredient: {
          include: { nutrients: true },
        },
      },
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSodium = 0;

    for (const ri of recipeIngredients) {
      const nutrient = ri.ingredient.nutrients;
      if (!nutrient) continue;

      // Nutrients are per 100g, scale by ingredient quantity
      const qty = Number(ri.quantity);
      const factor = qty / 100;

      totalCalories += Number(nutrient.caloriesPer100g) * factor;
      totalProtein += Number(nutrient.proteinPer100g) * factor;
      totalCarbs += Number(nutrient.carbsPer100g) * factor;
      totalFat += Number(nutrient.fatPer100g) * factor;
      if (nutrient.fiberPer100g) totalFiber += Number(nutrient.fiberPer100g) * factor;
      if (nutrient.sodiumPer100g) totalSodium += Number(nutrient.sodiumPer100g) * factor;
    }

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: totalFiber > 0 ? Math.round(totalFiber * 10) / 10 : null,
      sodium: totalSodium > 0 ? Math.round(totalSodium) : null,
    };
  }
}
