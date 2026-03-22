import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { paginate } from '@/common/dto/pagination.dto';

@Injectable()
export class MealLogsService {
  constructor(private prisma: PrismaService) {}

  // G13: Create meal log (after cooking / rating)
  async create(userId: string, data: {
    recipeId: string;
    mealType: string;
    date?: string;
    rating?: number;
    notes?: string;
    profileId?: string;
  }) {
    return this.prisma.mealLog.create({
      data: {
        userId,
        recipeId: data.recipeId,
        mealType: data.mealType as any,
        date: data.date ? new Date(data.date) : new Date(),
        rating: data.rating,
        notes: data.notes,
        profileId: data.profileId,
      },
      include: {
        recipe: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
    });
  }

  // G14: List meal logs (history)
  async list(userId: string, params: {
    startDate?: string;
    endDate?: string;
    mealType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { startDate, endDate, mealType, page = 1, pageSize = 20 } = params;

    const where: any = { userId };
    if (mealType) where.mealType = mealType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      this.prisma.mealLog.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          recipe: {
            select: {
              id: true, name: true, imageUrl: true, cuisine: true,
              cookTime: true, difficulty: true,
            },
            include: { nutritionInfo: true },
          },
        },
      }),
      this.prisma.mealLog.count({ where }),
    ]);

    return paginate(logs, total, page, pageSize);
  }

  // G15: Cooking stats
  async getStats(userId: string) {
    const [
      totalMeals,
      totalDays,
      avgRating,
      topRecipes,
      cuisineBreakdown,
    ] = await Promise.all([
      // Total meals cooked
      this.prisma.mealLog.count({ where: { userId } }),
      // Distinct cooking days
      this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(DISTINCT date) as count FROM meal_logs WHERE user_id = ${userId}::uuid
      `,
      // Average rating
      this.prisma.mealLog.aggregate({
        where: { userId, rating: { not: null } },
        _avg: { rating: true },
      }),
      // Top 5 most cooked recipes
      this.prisma.$queryRaw<Array<{ recipe_id: string; name: string; cook_count: bigint }>>`
        SELECT ml.recipe_id, r.name, COUNT(*) as cook_count
        FROM meal_logs ml
        JOIN recipes r ON r.id = ml.recipe_id
        WHERE ml.user_id = ${userId}::uuid
        GROUP BY ml.recipe_id, r.name
        ORDER BY cook_count DESC
        LIMIT 5
      `,
      // Cuisine breakdown
      this.prisma.$queryRaw<Array<{ cuisine: string; count: bigint }>>`
        SELECT r.cuisine, COUNT(*) as count
        FROM meal_logs ml
        JOIN recipes r ON r.id = ml.recipe_id
        WHERE ml.user_id = ${userId}::uuid
        GROUP BY r.cuisine
        ORDER BY count DESC
      `,
    ]);

    // Calculate cooking streak
    const streak = await this.calculateStreak(userId);

    return {
      totalMeals,
      totalDays: Number(totalDays[0]?.count || 0),
      averageRating: avgRating._avg.rating ? Math.round(avgRating._avg.rating * 10) / 10 : null,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      topRecipes: topRecipes.map((r: any) => ({
        recipeId: r.recipe_id,
        name: r.name,
        cookCount: Number(r.cook_count),
      })),
      cuisineBreakdown: cuisineBreakdown.map((c: any) => ({
        cuisine: c.cuisine,
        count: Number(c.count),
        percentage: totalMeals > 0 ? Math.round((Number(c.count) / totalMeals) * 100) : 0,
      })),
    };
  }

  // Calculate consecutive cooking days streak
  private async calculateStreak(userId: string): Promise<{ current: number; longest: number }> {
    const dates = await this.prisma.$queryRaw<Array<{ date: Date }>>`
      SELECT DISTINCT date FROM meal_logs
      WHERE user_id = ${userId}::uuid
      ORDER BY date DESC
    `;

    if (dates.length === 0) return { current: 0, longest: 0 };

    let current = 1;
    let longest = 1;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDate = new Date(dates[0].date);
    firstDate.setHours(0, 0, 0, 0);

    // Check if streak is still active (last cooking was today or yesterday)
    const diffDays = Math.floor((today.getTime() - firstDate.getTime()) / (86400000));
    if (diffDays > 1) current = 0;

    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1].date);
      const curr = new Date(dates[i].date);
      const diff = Math.floor((prev.getTime() - curr.getTime()) / 86400000);

      if (diff === 1) {
        tempStreak++;
        if (i <= current || current > 0) current = tempStreak;
      } else {
        longest = Math.max(longest, tempStreak);
        tempStreak = 1;
        if (current > 0 && i > 1) current = tempStreak;
      }
    }
    longest = Math.max(longest, tempStreak);

    return { current: current > 0 ? current : 0, longest };
  }
}
