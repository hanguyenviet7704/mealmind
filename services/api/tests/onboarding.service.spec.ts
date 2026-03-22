import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from '../src/modules/onboarding/onboarding.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { RedisService } from '../src/common/redis/redis.service';

describe('OnboardingService', () => {
  let service: OnboardingService;

  const mockPrisma = {
    tasteProfile: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    dietaryRestriction: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockRedis = {
    del: jest.fn(),
    getJson: jest.fn(),
    setJson: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnboardingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<OnboardingService>(OnboardingService);
    jest.clearAllMocks();
  });

  describe('submitQuiz', () => {
    it('should create taste profile and update user', async () => {
      const profile = {
        id: 'profile-1',
        userId: 'user-1',
        profileName: 'Tôi',
        isPrimary: true,
        regions: ['north', 'south'],
        spiceLevel: 4,
        sweetLevel: 3,
        saltLevel: 3,
      };

      mockPrisma.tasteProfile.create.mockResolvedValue(profile);
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.submitQuiz('user-1', {
        regions: ['north', 'south'],
        spiceLevel: 4,
      });

      expect(result.regions).toEqual(['north', 'south']);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({ onboardingCompleted: true }),
        }),
      );
    });
  });

  describe('skipQuiz', () => {
    it('should create default profile with level 3 for everything', async () => {
      mockPrisma.tasteProfile.create.mockResolvedValue({
        id: 'profile-1',
        spiceLevel: 3,
        sweetLevel: 3,
        saltLevel: 3,
        dietType: 'normal',
      });
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.skipQuiz('user-1');
      expect(result.spiceLevel).toBe(3);
      expect(result.sweetLevel).toBe(3);
      expect(result.saltLevel).toBe(3);
    });
  });

  describe('getMergedPreferences', () => {
    it('should merge family preferences correctly', async () => {
      mockPrisma.tasteProfile.findMany.mockResolvedValue([
        {
          id: 'p1',
          regions: ['north'],
          spiceLevel: 4,
          sweetLevel: 2,
          saltLevel: 3,
          dietType: 'normal',
          maxCookTime: 'thirty_to_60',
          familySize: 2,
          dietaryRestrictions: [{ allergens: ['peanuts'] }],
        },
        {
          id: 'p2',
          regions: ['south'],
          spiceLevel: 2,
          sweetLevel: 4,
          saltLevel: 3,
          dietType: 'lacto_ovo_vegetarian',
          maxCookTime: 'fifteen_to_30',
          familySize: 1,
          dietaryRestrictions: [{ allergens: ['dairy'] }],
        },
      ]);

      const result = await service.getMergedPreferences('user-1');

      // Union regions
      expect(result.regions).toContain('north');
      expect(result.regions).toContain('south');

      // Average taste
      expect(result.spiceLevel).toBe(3); // (4+2)/2

      // Union allergens
      expect(result.allergens).toContain('peanuts');
      expect(result.allergens).toContain('dairy');

      // Strictest diet
      expect(result.dietType).toBe('lacto_ovo_vegetarian');
    });
  });

  describe('createFamilyProfile', () => {
    it('should throw MaxProfilesException when limit reached', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ subscriptionTier: 'free' });
      mockPrisma.tasteProfile.count.mockResolvedValue(6);

      await expect(
        service.createFamilyProfile('user-1', { name: 'Test' }),
      ).rejects.toThrow('Đã đạt giới hạn 6 profile');
    });
  });

  describe('deleteFamilyProfile', () => {
    it('should throw CannotDeletePrimaryException for primary profile', async () => {
      mockPrisma.tasteProfile.findFirst.mockResolvedValue({
        id: 'p1',
        userId: 'user-1',
        isPrimary: true,
      });

      await expect(
        service.deleteFamilyProfile('user-1', 'p1'),
      ).rejects.toThrow('Không thể xóa profile chính');
    });
  });
});
