import { Test, TestingModule } from '@nestjs/testing';
import { MealLogsService } from '../src/modules/meal-logs/meal-logs.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('MealLogsService', () => {
  let service: MealLogsService;

  const mockPrisma = {
    mealLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealLogsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MealLogsService>(MealLogsService);
    jest.clearAllMocks();
  });

  // ==========================================
  // G13: Create meal log
  // ==========================================
  describe('create', () => {
    it('should create a meal log with rating', async () => {
      const expected = {
        id: 'ml-1',
        userId: 'user-1',
        recipeId: 'r1',
        mealType: 'lunch',
        rating: 5,
        recipe: { id: 'r1', name: 'Phở bò', imageUrl: '/pho.jpg' },
      };
      mockPrisma.mealLog.create.mockResolvedValue(expected);

      const result = await service.create('user-1', {
        recipeId: 'r1',
        mealType: 'lunch',
        rating: 5,
      });

      expect(result.id).toBe('ml-1');
      expect(result.rating).toBe(5);
      expect(result.recipe.name).toBe('Phở bò');
    });

    it('should create meal log without optional fields', async () => {
      mockPrisma.mealLog.create.mockResolvedValue({
        id: 'ml-2', userId: 'user-1', recipeId: 'r1', mealType: 'dinner',
        rating: null, notes: null, recipe: { id: 'r1', name: 'Bún bò', imageUrl: '' },
      });

      const result = await service.create('user-1', {
        recipeId: 'r1',
        mealType: 'dinner',
      });

      expect(result.rating).toBeNull();
    });

    it('should use provided date if given', async () => {
      mockPrisma.mealLog.create.mockResolvedValue({ id: 'ml-3' });

      await service.create('user-1', {
        recipeId: 'r1',
        mealType: 'breakfast',
        date: '2026-03-20',
      });

      expect(mockPrisma.mealLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            date: new Date('2026-03-20'),
          }),
        }),
      );
    });
  });

  // ==========================================
  // G14: List meal logs
  // ==========================================
  describe('list', () => {
    it('should return paginated meal logs', async () => {
      mockPrisma.mealLog.findMany.mockResolvedValue([
        { id: 'ml-1', recipe: { id: 'r1', name: 'Phở' } },
      ]);
      mockPrisma.mealLog.count.mockResolvedValue(1);

      const result = await service.list('user-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by date range', async () => {
      mockPrisma.mealLog.findMany.mockResolvedValue([]);
      mockPrisma.mealLog.count.mockResolvedValue(0);

      await service.list('user-1', {
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      });

      expect(mockPrisma.mealLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-1',
            date: {
              gte: new Date('2026-03-01'),
              lte: new Date('2026-03-31'),
            },
          }),
        }),
      );
    });

    it('should filter by mealType', async () => {
      mockPrisma.mealLog.findMany.mockResolvedValue([]);
      mockPrisma.mealLog.count.mockResolvedValue(0);

      await service.list('user-1', { mealType: 'breakfast' });

      expect(mockPrisma.mealLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ mealType: 'breakfast' }),
        }),
      );
    });
  });

  // ==========================================
  // G15: Stats
  // ==========================================
  describe('getStats', () => {
    it('should return aggregated cooking stats', async () => {
      mockPrisma.mealLog.count.mockResolvedValue(25);
      mockPrisma.$queryRaw
        .mockResolvedValueOnce([{ count: BigInt(15) }]) // distinct days
        .mockResolvedValueOnce([ // top recipes
          { recipe_id: 'r1', name: 'Phở bò', cook_count: BigInt(8) },
          { recipe_id: 'r2', name: 'Bún bò', cook_count: BigInt(5) },
        ])
        .mockResolvedValueOnce([ // cuisine breakdown
          { cuisine: 'north', count: BigInt(15) },
          { cuisine: 'south', count: BigInt(10) },
        ])
        .mockResolvedValueOnce([]); // streak dates

      mockPrisma.mealLog.aggregate.mockResolvedValue({
        _avg: { rating: 4.2 },
      });

      const result = await service.getStats('user-1');

      expect(result.totalMeals).toBe(25);
      expect(result.totalDays).toBe(15);
      expect(result.averageRating).toBe(4.2);
      expect(result.topRecipes).toHaveLength(2);
      expect(result.topRecipes[0].name).toBe('Phở bò');
      expect(result.topRecipes[0].cookCount).toBe(8);
      expect(result.cuisineBreakdown).toHaveLength(2);
      expect(result.cuisineBreakdown[0].cuisine).toBe('north');
      expect(result.cuisineBreakdown[0].percentage).toBe(60); // 15/25
    });

    it('should handle zero meals case', async () => {
      mockPrisma.mealLog.count.mockResolvedValue(0);
      mockPrisma.$queryRaw
        .mockResolvedValueOnce([{ count: BigInt(0) }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockPrisma.mealLog.aggregate.mockResolvedValue({
        _avg: { rating: null },
      });

      const result = await service.getStats('user-1');

      expect(result.totalMeals).toBe(0);
      expect(result.averageRating).toBeNull();
      expect(result.topRecipes).toHaveLength(0);
      expect(result.currentStreak).toBe(0);
    });
  });
});
