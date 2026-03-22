import { Test, TestingModule } from '@nestjs/testing';
import { NutritionService } from '../src/modules/nutrition/nutrition.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { RedisService } from '../src/common/redis/redis.service';

describe('NutritionService', () => {
  let service: NutritionService;

  const mockPrisma = {
    recipe: { findUnique: jest.fn() },
    nutritionInfo: { findUnique: jest.fn() },
    recipeIngredient: { findMany: jest.fn() },
    mealPlan: { findFirst: jest.fn() },
    nutritionGoal: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    getJson: jest.fn(),
    setJson: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutritionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<NutritionService>(NutritionService);
    jest.clearAllMocks();
  });

  // ==========================================
  // NT-001: Get recipe nutrition
  // ==========================================
  describe('getRecipeNutrition', () => {
    it('should return cached nutrition if available', async () => {
      mockRedis.getJson.mockResolvedValue({
        calories: 450, protein: 25, carbs: 60, fat: 12,
      });
      mockPrisma.recipe.findUnique.mockResolvedValue({ id: 'r1', servings: 4 });

      const result = await service.getRecipeNutrition('r1');

      expect(result.calories).toBe(450);
      expect(result.servings).toBe(4);
      // Should NOT re-query nutritionInfo when cached
      expect(mockPrisma.nutritionInfo.findUnique).not.toHaveBeenCalled();
    });

    it('should use pre-calculated nutrition if not cached', async () => {
      mockRedis.getJson.mockResolvedValue(null);
      mockPrisma.nutritionInfo.findUnique.mockResolvedValue({
        calories: '500', protein: '30', carbs: '65', fat: '15',
        fiber: '5', sodium: '900',
      });
      mockPrisma.recipe.findUnique.mockResolvedValue({ id: 'r1', servings: 2 });

      const result = await service.getRecipeNutrition('r1');

      expect(result.calories).toBe(500);
      expect(result.servings).toBe(2);
      // Should cache the result
      expect(mockRedis.setJson).toHaveBeenCalledWith('nutrition:r1', expect.any(Object), 3600);
    });

    it('should scale nutrition when custom servings requested', async () => {
      mockRedis.getJson.mockResolvedValue({
        calories: 400, protein: 20, carbs: 50, fat: 10, fiber: 4, sodium: null,
      });
      mockPrisma.recipe.findUnique.mockResolvedValue({ id: 'r1', servings: 4 });

      const result = await service.getRecipeNutrition('r1', 2); // half servings

      expect(result.calories).toBe(200); // 400 * (2/4)
      expect(result.protein).toBe(10);
      expect(result.servings).toBe(2);
    });

    it('should throw 404 for non-existent recipe', async () => {
      mockRedis.getJson.mockResolvedValue(null);
      mockPrisma.nutritionInfo.findUnique.mockResolvedValue(null);
      mockPrisma.recipeIngredient.findMany.mockResolvedValue([]);
      mockPrisma.recipe.findUnique.mockResolvedValue(null);

      await expect(
        service.getRecipeNutrition('nonexistent'),
      ).rejects.toThrow('Recipe không tìm thấy');
    });
  });

  // ==========================================
  // NT-002: Daily nutrition
  // ==========================================
  describe('getDailyNutrition', () => {
    it('should return empty when no active plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue(null);
      mockPrisma.nutritionGoal.findFirst.mockResolvedValue(null);

      const result = await service.getDailyNutrition('user-1');

      expect(result.totalCalories).toBe(0);
      expect(result.meals).toEqual([]);
    });

    it('should sum nutrition for a specific day', async () => {
      const today = new Date();
      const dayOfWeek = today.getDay() || 7;

      mockPrisma.mealPlan.findFirst.mockResolvedValue({
        id: 'plan-1',
        items: [
          {
            day: dayOfWeek, mealType: 'breakfast',
            recipe: {
              id: 'r1', name: 'Phở', imageUrl: '/pho.jpg',
              nutritionInfo: { calories: '450', protein: '25', carbs: '60', fat: '12' },
            },
          },
          {
            day: dayOfWeek, mealType: 'lunch',
            recipe: {
              id: 'r2', name: 'Cơm', imageUrl: '/com.jpg',
              nutritionInfo: { calories: '550', protein: '30', carbs: '70', fat: '18' },
            },
          },
        ],
      });
      mockPrisma.nutritionGoal.findFirst.mockResolvedValue(null);

      const result = await service.getDailyNutrition('user-1');

      expect(result.totalCalories).toBe(1000); // 450 + 550
      expect(result.meals).toHaveLength(2);
      expect(result.goals).toBeDefined();
    });
  });

  // ==========================================
  // NT-003: Weekly nutrition
  // ==========================================
  describe('getWeeklyNutrition', () => {
    it('should return empty when no active plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue(null);

      const result = await service.getWeeklyNutrition('user-1');

      expect(result.days).toEqual([]);
      expect(result.onTargetCount).toBe(0);
    });
  });

  // ==========================================
  // NT-004: Nutrition goals
  // ==========================================
  describe('getGoals', () => {
    it('should return default goals when none set', async () => {
      mockPrisma.nutritionGoal.findFirst.mockResolvedValue(null);

      const result = await service.getGoals('user-1');

      expect(result.caloriesPerDay).toBe(2000);
      expect(result.preset).toBe('maintain');
    });

    it('should return user custom goals', async () => {
      mockPrisma.nutritionGoal.findFirst.mockResolvedValue({
        dailyCalories: 1500,
        dailyProteinGrams: '130',
        dailyCarbGrams: '150',
        dailyFatGrams: '50',
        preset: 'loss',
      });

      const result = await service.getGoals('user-1');

      expect(result.caloriesPerDay).toBe(1500);
      expect(result.proteinPerDay).toBe(130);
      expect(result.preset).toBe('loss');
    });
  });

  describe('updateGoals', () => {
    it('should apply preset values', async () => {
      mockPrisma.nutritionGoal.findFirst.mockResolvedValue(null);
      mockPrisma.nutritionGoal.create.mockResolvedValue({
        dailyCalories: 1500, preset: 'loss',
      });

      const result = await service.updateGoals('user-1', { preset: 'loss' });
      expect(result.dailyCalories).toBe(1500);
    });

    it('should update existing goals', async () => {
      mockPrisma.nutritionGoal.findFirst.mockResolvedValue({ id: 'g1' });
      mockPrisma.nutritionGoal.update.mockResolvedValue({
        dailyCalories: 1800, preset: 'custom',
      });

      const result = await service.updateGoals('user-1', { caloriesPerDay: 1800 });
      expect(result.dailyCalories).toBe(1800);
    });
  });
});
