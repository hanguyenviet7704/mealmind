import { Test, TestingModule } from '@nestjs/testing';
import { DietaryService } from '../src/modules/dietary/dietary.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('DietaryService', () => {
  let service: DietaryService;

  const mockPrisma = {
    user: { findUnique: jest.fn() },
    dietaryRestriction: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    tasteProfile: { findFirst: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietaryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DietaryService>(DietaryService);
    jest.clearAllMocks();
  });

  // ==========================================
  // DF-001: Get dietary restrictions
  // ==========================================
  describe('getDietaryRestrictions', () => {
    it('should return dietary restrictions for own user', async () => {
      mockPrisma.dietaryRestriction.findFirst.mockResolvedValue({
        id: 'dr-1',
        userId: 'user-1',
        dietType: 'lacto_ovo_vegetarian',
        allergens: ['peanuts', 'gluten'],
        customBlacklist: ['rau mùi'],
      });

      const result = await service.getDietaryRestrictions('user-1', 'user-1');

      expect(result.allergens).toContain('peanuts');
    });

    it('should return defaults when no restrictions set', async () => {
      mockPrisma.dietaryRestriction.findFirst.mockResolvedValue(null);

      const result = await service.getDietaryRestrictions('user-1', 'user-1');

      expect(result.dietType).toBe('normal');
      expect(result.allergens).toEqual([]);
    });

    it('should throw ResourceForbiddenException for other user (403)', async () => {
      await expect(
        service.getDietaryRestrictions('user-1', 'user-2'),
      ).rejects.toThrow('Bạn không có quyền truy cập');
    });
  });

  // ==========================================
  // DF-001: Update dietary restrictions
  // ==========================================
  describe('updateDietaryRestrictions', () => {
    it('should update existing dietary restrictions', async () => {
      mockPrisma.tasteProfile.findFirst.mockResolvedValue({ id: 'profile-1' });
      mockPrisma.dietaryRestriction.findFirst.mockResolvedValue({
        id: 'dr-1', userId: 'user-1',
      });
      mockPrisma.dietaryRestriction.update.mockResolvedValue({
        dietType: 'keto',
        allergens: ['dairy'],
      });

      const result = await service.updateDietaryRestrictions('user-1', 'user-1', {
        dietType: 'keto',
        allergens: ['dairy'],
      });

      expect(result.dietType).toBe('keto');
    });

    it('should create dietary restrictions if none exist', async () => {
      mockPrisma.tasteProfile.findFirst.mockResolvedValue({ id: 'profile-1' });
      mockPrisma.dietaryRestriction.findFirst.mockResolvedValue(null);
      mockPrisma.dietaryRestriction.create.mockResolvedValue({
        dietType: 'normal',
        allergens: ['gluten'],
      });

      const result = await service.updateDietaryRestrictions('user-1', 'user-1', {
        allergens: ['gluten'],
      });

      expect(result.allergens).toContain('gluten');
    });

    it('should throw ResourceForbiddenException for other user (403)', async () => {
      await expect(
        service.updateDietaryRestrictions('user-1', 'user-2', { dietType: 'keto' }),
      ).rejects.toThrow('Bạn không có quyền truy cập');
    });
  });

  // ==========================================
  // DF-002: Get dietary options (master data)
  // ==========================================
  describe('getDietaryOptions', () => {
    it('should return all dietary option categories', () => {
      const result = service.getDietaryOptions();

      expect(result.dietTypes).toBeDefined();
      expect(result.allergens).toBeDefined();
      expect(result.medicalConditions).toBeDefined();
      expect(result.religiousDiets).toBeDefined();
    });

    it('should contain required diet types', () => {
      const result = service.getDietaryOptions();
      const keys = result.dietTypes.map((d: any) => d.key);

      expect(keys).toContain('normal');
      expect(keys).toContain('vegan');
      expect(keys).toContain('keto');
      expect(keys).toContain('low_carb');
    });

    it('should contain Vietnamese labels', () => {
      const result = service.getDietaryOptions();
      const normal = result.dietTypes.find((d: any) => d.key === 'normal');

      expect(normal?.label).toBe('Bình thường');
    });

    it('should contain allergen options', () => {
      const result = service.getDietaryOptions();
      const keys = result.allergens.map((a: any) => a.key);

      expect(keys).toContain('shellfish');
      expect(keys).toContain('peanuts');
      expect(keys).toContain('gluten');
      expect(keys).toContain('dairy');
    });

    it('should mark medical conditions as phase2', () => {
      const result = service.getDietaryOptions();

      result.medicalConditions.forEach((m: any) => {
        expect(m.phase).toBe('phase2');
      });
    });
  });

  // ==========================================
  // DF-003: Filter criteria for recommendations
  // ==========================================
  describe('getFilterCriteria', () => {
    it('should return empty filters when no restrictions', async () => {
      mockPrisma.dietaryRestriction.findFirst.mockResolvedValue(null);

      const result = await service.getFilterCriteria('user-1');

      expect(result.excludeAllergens).toEqual([]);
      expect(result.excludeIngredients).toEqual([]);
    });

    it('should return allergens and blacklist from restrictions', async () => {
      mockPrisma.dietaryRestriction.findFirst.mockResolvedValue({
        allergens: ['peanuts', 'gluten'],
        customBlacklist: ['rau mùi'],
      });

      const result = await service.getFilterCriteria('user-1');

      expect(result.excludeAllergens).toContain('peanuts');
      expect(result.excludeIngredients).toContain('rau mùi');
    });
  });

  // ==========================================
  // DF-004: Build dietary WHERE for Prisma
  // ==========================================
  describe('buildDietaryFilter', () => {
    it('should return empty filter for normal diet', () => {
      const result = service.buildDietaryFilter('normal', [], []);
      expect(result).toEqual({});
    });

    it('should add vegan tag filter', () => {
      const result = service.buildDietaryFilter('vegan', [], []);
      expect(result.AND).toBeDefined();
      expect(result.AND).toContainEqual({ tags: { has: 'vegan' } });
    });

    it('should exclude allergens', () => {
      const result = service.buildDietaryFilter('normal', ['peanuts', 'gluten'], []);
      expect(result.AND).toBeDefined();
      expect(result.AND).toContainEqual({
        NOT: { allergenTags: { hasSome: ['peanuts', 'gluten'] } },
      });
    });
  });
});
