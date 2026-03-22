import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ResourceNotFoundException, ResourceConflictException } from '@/common/exceptions';
import { paginate } from '@/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  // RD-001: List recipes with pagination, filter, sort
  async listRecipes(params: {
    cuisine?: string;
    mealType?: string;
    difficulty?: string;
    maxCookTime?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
  }) {
    const {
      cuisine, mealType, difficulty, maxCookTime,
      sortBy = 'popularity', sortOrder = 'desc',
      page = 1, pageSize = 20,
    } = params;

    const where: any = {
      isPublished: true,
      ...(cuisine && { cuisine: cuisine as any }),
      ...(difficulty && { difficulty: difficulty as any }),
      ...(maxCookTime && { cookTime: { lte: maxCookTime } }),
      ...(mealType && { mealTypes: { array_contains: mealType } }),
    };

    const orderBy = this.buildOrderBy(sortBy, sortOrder);
    const skip = (page - 1) * pageSize;

    const [recipes, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: { nutritionInfo: true },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    const data = recipes.map((r) => this.toSummary(r));
    return paginate(data, total, page, pageSize);
  }

  // RD-002: Recipe detail
  async getRecipeDetail(recipeId: string, servings?: number, userId?: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: { ingredient: true },
          orderBy: [{ groupType: 'asc' }, { sortOrder: 'asc' }],
        },
        steps: { orderBy: { stepNumber: 'asc' } },
        nutritionInfo: true,
      },
    });

    if (!recipe) throw new ResourceNotFoundException('Recipe');

    const requestedServings = servings || recipe.servings;
    const scaleFactor = requestedServings / recipe.servings;

    // Check bookmark status
    let isBookmarked = false;
    if (userId) {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { userId_recipeId: { userId, recipeId } },
      });
      isBookmarked = !!bookmark;
    }

    return {
      id: recipe.id,
      name: recipe.name,
      imageUrl: recipe.imageUrl,
      description: recipe.description,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.prepTime + recipe.cookTime,
      defaultServings: recipe.servings,
      requestedServings,
      mealTypes: recipe.mealTypes,
      videoUrl: recipe.videoUrl,
      tags: recipe.tags,
      isBookmarked,
      ingredients: recipe.ingredients.map((ri) => ({
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        quantity: this.scaleQuantity(Number(ri.quantity), scaleFactor),
        originalQuantity: Number(ri.quantity),
        unit: ri.unit,
        group: ri.groupType,
        isOptional: ri.isOptional,
      })),
      steps: recipe.steps.map((s) => ({
        stepNumber: s.stepNumber,
        description: s.description,
        imageUrl: s.imageUrl,
        duration: s.durationMinutes,
      })),
      nutrition: recipe.nutritionInfo
        ? {
            calories: Number(recipe.nutritionInfo.calories),
            protein: Number(recipe.nutritionInfo.protein),
            carbs: Number(recipe.nutritionInfo.carbs),
            fat: Number(recipe.nutritionInfo.fat),
            fiber: recipe.nutritionInfo.fiber ? Number(recipe.nutritionInfo.fiber) : null,
            sodium: recipe.nutritionInfo.sodium ? Number(recipe.nutritionInfo.sodium) : null,
            servings: requestedServings,
          }
        : null,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    };
  }

  // RD-003: Ingredient scaling
  private scaleQuantity(original: number, factor: number): number {
    const scaled = original * factor;
    // Round to 1 decimal for readability
    return Math.round(scaled * 10) / 10;
  }

  // RD-004: Bookmark
  async bookmarkRecipe(userId: string, recipeId: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) throw new ResourceNotFoundException('Recipe');

    try {
      const bookmark = await this.prisma.bookmark.create({
        data: { userId, recipeId },
      });
      return bookmark;
    } catch (e: any) {
      if (e.code === 'P2002') throw new ResourceConflictException('Bookmark');
      throw e;
    }
  }

  async removeBookmark(userId: string, recipeId: string) {
    try {
      await this.prisma.bookmark.delete({
        where: { userId_recipeId: { userId, recipeId } },
      });
    } catch (e: any) {
      if (e.code === 'P2025') throw new ResourceNotFoundException('Bookmark');
      throw e;
    }
  }

  async getBookmarkedRecipes(userId: string, params: {
    q?: string; cuisine?: string; mealType?: string;
    page?: number; pageSize?: number;
  }) {
    const { q, cuisine, mealType, page = 1, pageSize = 20 } = params;

    const where: any = {
      userId,
      recipe: {
        isPublished: true,
        ...(cuisine && { cuisine: cuisine as any }),
        ...(mealType && { mealTypes: { array_contains: mealType } }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: 'insensitive' as any } },
            { nameAscii: { contains: q, mode: 'insensitive' as any } },
          ],
        }),
      },
    };

    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          recipe: { include: { nutritionInfo: true } },
        },
      }),
      this.prisma.bookmark.count({ where }),
    ]);

    const data = bookmarks.map((b) => ({
      ...this.toSummary(b.recipe),
      isBookmarked: true,
    }));

    return paginate(data, total, page, pageSize);
  }

  // RD-random: Get random recipes
  async getRandomRecipes(count = 1) {
    // In-memory shuffle for random ordering (DB agnostic)
    const recipes = await this.prisma.recipe.findMany({
      where: { isPublished: true },
      include: { nutritionInfo: true },
    });

    // Shuffle and take 'count'
    const shuffled = recipes.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);
    return picked.map((r) => this.toSummary(r));
  }

  // AI-001: Get AI generated Combo
  async getAiCombo(servings: number = 2) {
    const allRecipes = await this.prisma.recipe.findMany({
      where: { isPublished: true },
      include: { nutritionInfo: true },
    });
    
    const minimalRecipes = allRecipes.map(r => ({
      id: r.id,
      name: r.name,
      calories: r.nutritionInfo?.calories ? Number(r.nutritionInfo.calories) : null
    }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const res = await fetch('http://localhost:8000/api/v1/recommend/combo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available_recipes: minimalRecipes, servings }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const aiResult = await res.json();
      const comboIds = aiResult.combo || [];
      const reason = aiResult.reason || '';

      if (comboIds.length === 0) {
        throw new Error('AI returned empty combo');
      }

      // Re-fetch picked recipes
      const pickedRecipes = await this.prisma.recipe.findMany({
        where: { id: { in: comboIds } },
        include: { nutritionInfo: true }
      });

      // Maintain AI returned order
      const sortedPicked = comboIds
        .map((id: string) => pickedRecipes.find(r => r.id === id))
        .filter(Boolean);

      return {
        combo: sortedPicked.map((r: any) => this.toSummary(r)),
        reason
      };
    } catch (e) {
      console.error('AI Combo Error:', e);
      // Fallback
      return {
        combo: await this.getRandomRecipes(3), // combo usually has 3-4 items
        reason: 'Hệ thống gợi ý AI đang bận, dưới đây là gợi ý mâm cơm ngẫu nhiên!'
      };
    }
  }

  // Helpers
  private toSummary(recipe: any) {
    return {
      id: recipe.id,
      name: recipe.name,
      imageUrl: recipe.imageUrl,
      description: recipe.description,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.prepTime + recipe.cookTime,
      defaultServings: recipe.servings,
      calories: recipe.nutritionInfo ? Number(recipe.nutritionInfo.calories) : null,
      mealTypes: recipe.mealTypes,
    };
  }

  private buildOrderBy(sortBy: string, sortOrder: string) {
    const order = sortOrder as 'asc' | 'desc';
    switch (sortBy) {
      case 'cookTime': return { cookTime: order };
      case 'calories': return { nutritionInfo: { calories: order } };
      case 'createdAt': return { createdAt: order };
      case 'popularity': default: return { popularityScore: order };
    }
  }
}
