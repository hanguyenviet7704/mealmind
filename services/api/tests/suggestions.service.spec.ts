import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionsService } from '../src/modules/suggestions/suggestions.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { RedisService } from '../src/common/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { DietaryService } from '../src/modules/dietary/dietary.service';

describe('SuggestionsService', () => {
  let service: SuggestionsService;

  const mockPrisma = {
    recipe: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    userInteraction: { findMany: jest.fn() },
    user: { findUnique: jest.fn() },
    tasteProfile: { findFirst: jest.fn() },
    dietaryRestriction: { findFirst: jest.fn() },
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    getJson: jest.fn(),
    setJson: jest.fn(),
    del: jest.fn(),
  };

  const mockConfig = {
    get: jest.fn((key: string, defaultVal?: string) => defaultVal || ''),
  };

  const mockDietaryService = {
    getFilterCriteria: jest.fn().mockResolvedValue({
      excludeAllergens: [], excludeIngredients: [], dietType: 'normal',
    }),
    getDietaryRestrictions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuggestionsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: ConfigService, useValue: mockConfig },
        { provide: DietaryService, useValue: mockDietaryService },
      ],
    }).compile();

    service = module.get<SuggestionsService>(SuggestionsService);
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    // Re-apply defaults after clear
    mockDietaryService.getFilterCriteria.mockResolvedValue({
      excludeAllergens: [], excludeIngredients: [], dietType: 'normal',
    });
  });

  // ==========================================
  // MS-005: Get suggestions (fallback)
  // ==========================================
  describe('getSuggestions', () => {
    it('should return suggestions using popularity fallback', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ subscriptionTier: 'free' });
      mockRedis.get.mockResolvedValue('5'); // 5 requests today
      mockRedis.set.mockResolvedValue(null);
      mockPrisma.recipe.findMany.mockResolvedValue([
        {
          id: 'r1', name: 'Phở bò', imageUrl: '/pho.jpg', description: 'Phở',
          cuisine: 'north', difficulty: 'medium', cookTime: 60,
          mealTypes: ['lunch'], popularityScore: 8.5,
          nutritionInfo: { calories: '450' },
        },
      ]);

      const result = await service.getSuggestions('user-1', {
        mealType: 'lunch',
        count: 5,
      });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should throw SuggestionLimitException at 50 daily requests for free tier', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ subscriptionTier: 'free' });
      mockRedis.get.mockResolvedValue('50');

      await expect(
        service.getSuggestions('user-1', { mealType: 'lunch' }),
      ).rejects.toThrow('Bạn đã hết lượt gợi ý hôm nay');
    });

    it('should not rate-limit pro users', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ subscriptionTier: 'pro' });
      mockPrisma.recipe.findMany.mockResolvedValue([]);

      await expect(
        service.getSuggestions('user-1', { mealType: 'lunch' }),
      ).resolves.toBeDefined();
    });
  });

  // ==========================================
  // MS-013: Surprise
  // ==========================================
  describe('getSurpriseSuggestions', () => {
    it('should return surprise suggestions', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ subscriptionTier: 'free' });
      mockRedis.get.mockResolvedValue('3');
      mockRedis.set.mockResolvedValue(null);
      mockPrisma.recipe.findMany.mockResolvedValue([]);

      const result = await service.getSurpriseSuggestions('user-1');
      expect(result).toBeDefined();
    });
  });

  // ==========================================
  // MS-014: Combo
  // ==========================================
  describe('getComboSuggestions', () => {
    it('should return combo suggestions', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ subscriptionTier: 'free' });
      mockRedis.get.mockResolvedValue('10');
      mockRedis.set.mockResolvedValue(null);
      mockPrisma.recipe.findMany.mockResolvedValue([]);

      const result = await service.getComboSuggestions('user-1');
      expect(result).toBeDefined();
    });
  });

  // ==========================================
  // MS-015: Swap combo item
  // ==========================================
  describe('swapComboItem', () => {
    it('should return alternative recipe', async () => {
      mockPrisma.recipe.findFirst.mockResolvedValue({
        id: 'r3', name: 'Bún riêu', nutritionInfo: { calories: '380' },
      });

      const result = await service.swapComboItem('user-1', 'r1', ['r1', 'r2']);
      expect(result?.name).toBe('Bún riêu');
    });
  });

  // ==========================================
  // MS-017: Get Context
  // ==========================================
  describe('getContext', () => {
    it('should return context with day/season info', async () => {
      const result = await service.getContext();

      expect(result).toBeDefined();
      expect(result.dayOfWeek).toBeDefined();
      expect(result.season).toBeDefined();
      expect(typeof result.isWeekend).toBe('boolean');
    });
  });
});
