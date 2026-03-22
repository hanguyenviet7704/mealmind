import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { DietaryService } from '../dietary/dietary.service';
import { SuggestionLimitException } from '@/common/exceptions';

@Injectable()
export class SuggestionsService {
  private readonly logger = new Logger(SuggestionsService.name);
  private readonly recommendationUrl: string;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private config: ConfigService,
    private dietaryService: DietaryService,
  ) {
    this.recommendationUrl = this.config.get('RECOMMENDATION_SERVICE_URL', 'http://localhost:8000');
  }

  // MS-005: Get suggestions
  async getSuggestions(userId: string, params: {
    profileId?: string; mealType?: string; count?: number;
  }) {
    // MS-018: Rate limiting
    await this.checkSuggestionLimit(userId);

    // Get dietary filters
    const filters = await this.dietaryService.getFilterCriteria(userId, params.profileId);

    // Build context
    const context = await this.buildContext();

    try {
      // Call recommendation service
      const response = await fetch(`${this.recommendationUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profileId: params.profileId,
          mealType: params.mealType || this.getCurrentMealType(),
          count: params.count || 5,
          context,
          filters,
          mode: 'standard',
        }),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) throw new Error(`Recommendation service error: ${response.status}`);
      const data = await response.json();

      // Enrich with recipe data
      return this.enrichSuggestions(data.suggestions, userId);
    } catch (error) {
      this.logger.warn('Recommendation service unavailable, using popularity fallback');
      return this.getPopularityFallback(userId, params.mealType, params.count || 5);
    }
  }

  // MS-013: Surprise suggestions
  async getSurpriseSuggestions(userId: string, profileId?: string) {
    await this.checkSuggestionLimit(userId);

    try {
      const response = await fetch(`${this.recommendationUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profileId,
          count: 5,
          mode: 'surprise',
          context: await this.buildContext(),
          filters: await this.dietaryService.getFilterCriteria(userId, profileId),
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) throw new Error('Recommendation service error');
      const data = await response.json();
      return this.enrichSuggestions(data.suggestions, userId);
    } catch {
      return this.getPopularityFallback(userId, undefined, 5);
    }
  }

  // MS-014: Combo suggestions
  async getComboSuggestions(userId: string, profileId?: string) {
    await this.checkSuggestionLimit(userId);

    try {
      const response = await fetch(`${this.recommendationUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profileId,
          count: 4,
          mode: 'combo',
          context: await this.buildContext(),
          filters: await this.dietaryService.getFilterCriteria(userId, profileId),
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) throw new Error('Recommendation service error');
      const data = await response.json();
      return this.enrichSuggestions(data.suggestions, userId);
    } catch {
      return this.getPopularityFallback(userId, undefined, 4);
    }
  }

  // MS-015: Swap combo item
  async swapComboItem(userId: string, recipeId: string, excludeIds: string[]) {
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        id: { notIn: [...excludeIds, recipeId] },
        isPublished: true,
      },
      orderBy: { popularityScore: 'desc' },
      include: { nutritionInfo: true },
    });

    return recipe;
  }

  // MS-016: Refresh suggestions
  async refreshSuggestions(userId: string, excludeIds: string[], params: {
    profileId?: string; mealType?: string; count?: number;
  }) {
    await this.checkSuggestionLimit(userId);
    // Same as getSuggestions but exclude seen IDs
    return this.getPopularityFallback(userId, params.mealType, params.count || 5, excludeIds);
  }

  // MS-017: Get current context (debug)
  async getContext() {
    return this.buildContext();
  }

  // MS-019: Weather integration
  async getWeather(lat: number, lon: number) {
    const cacheKey = `weather:${lat.toFixed(1)}:${lon.toFixed(1)}`;
    const cached = await this.redis.getJson<any>(cacheKey);
    if (cached) return cached;

    const apiKey = this.config.get('WEATHER_API_KEY');
    if (!apiKey) return null;

    try {
      const url = `${this.config.get('WEATHER_API_URL')}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) return null;

      const data = await response.json();
      const weather = {
        temperature: data.main.temp,
        condition: this.getWeatherCondition(data.main.temp, data.weather?.[0]?.main),
      };

      await this.redis.setJson(cacheKey, weather, 1800); // 30 min cache
      return weather;
    } catch {
      this.logger.warn('Weather API unavailable');
      return null;
    }
  }

  // ---- Helpers ----
  private async buildContext() {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const month = now.getMonth() + 1;

    let season = 'spring';
    if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else if (month >= 11 || month <= 1) season = 'winter';

    return {
      dayOfWeek,
      isWeekend,
      season,
      timeOfDay: `${hour}:00`,
      weather: null, // Would be populated with real lat/lon
    };
  }

  private getCurrentMealType(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'breakfast';
    if (hour >= 10 && hour < 14) return 'lunch';
    if (hour >= 17 && hour < 22) return 'dinner';
    return 'snack';
  }

  private getWeatherCondition(temp: number, weather?: string): string {
    if (weather?.toLowerCase().includes('rain')) return 'rainy';
    if (temp > 33) return 'hot';
    if (temp >= 26) return 'warm';
    if (temp >= 20) return 'cool';
    return 'cold';
  }

  private async getPopularityFallback(userId: string, mealType?: string, count = 5, excludeIds: string[] = []) {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        isPublished: true,
        ...(mealType && { mealTypes: { array_contains: mealType } }),
        ...(excludeIds.length > 0 && { id: { notIn: excludeIds } }),
      },
      orderBy: { popularityScore: 'desc' },
      take: count,
      include: { nutritionInfo: true },
    });

    return recipes.map((r: any) => ({
      recipeId: r.id,
      recipe: {
        id: r.id,
        name: r.name,
        imageUrl: r.imageUrl,
        description: r.description,
        cuisine: r.cuisine,
        difficulty: r.difficulty,
        cookTime: r.cookTime,
        calories: r.nutritionInfo ? Number(r.nutritionInfo.calories) : null,
        mealTypes: r.mealTypes,
      },
      score: r.popularityScore,
      reasonType: 'popularity',
      reason: 'Món phổ biến',
    }));
  }

  private async enrichSuggestions(suggestions: any[], userId: string) {
    const recipeIds = suggestions.map((s: any) => s.recipeId);
    const recipes = await this.prisma.recipe.findMany({
      where: { id: { in: recipeIds } },
      include: { nutritionInfo: true },
    });

    const recipeMap = new Map(recipes.map((r) => [r.id, r]));

    return suggestions.map((s: any) => {
      const recipe = recipeMap.get(s.recipeId) as any;
      return {
        ...s,
        recipe: recipe ? {
          id: recipe.id,
          name: recipe.name,
          imageUrl: recipe.imageUrl,
          description: recipe.description,
          cuisine: recipe.cuisine,
          difficulty: recipe.difficulty,
          cookTime: recipe.cookTime,
          calories: recipe.nutritionInfo ? Number(recipe.nutritionInfo.calories) : null,
          mealTypes: recipe.mealTypes,
        } : null,
      };
    });
  }

  // MS-018: Rate limiting for Free tier
  private async checkSuggestionLimit(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.subscriptionTier === 'pro') return;

    const key = `suggestion_count:${userId}:${new Date().toISOString().split('T')[0]}`;
    const count = await this.redis.get(key);
    if (count && parseInt(count) >= 50) throw new SuggestionLimitException();

    const newCount = count ? parseInt(count) + 1 : 1;
    await this.redis.set(key, newCount.toString(), 86400); // 24h TTL
  }
}
