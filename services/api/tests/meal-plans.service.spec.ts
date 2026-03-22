import { Test, TestingModule } from '@nestjs/testing';
import { MealPlansService } from '../src/modules/meal-plans/meal-plans.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('MealPlansService', () => {
  let service: MealPlansService;

  const mockPrisma = {
    mealPlan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    mealPlanItem: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    mealPlanShare: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    recipe: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockConfig = {
    get: jest.fn((key: string, defaultVal?: string) => defaultVal || 'http://localhost:8000'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealPlansService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<MealPlansService>(MealPlansService);
    jest.clearAllMocks();
    // Suppress console warnings from fallback logic
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  // ==========================================
  // MP-003: List Meal Plans
  // ==========================================
  describe('listMealPlans', () => {
    it('should return paginated meal plans', async () => {
      mockPrisma.mealPlan.findMany.mockResolvedValue([
        { id: 'plan-1', status: 'draft', _count: { items: 21 } },
      ]);
      mockPrisma.mealPlan.count.mockResolvedValue(1);

      const result = await service.listMealPlans('user-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrisma.mealPlan.findMany.mockResolvedValue([]);
      mockPrisma.mealPlan.count.mockResolvedValue(0);

      await service.listMealPlans('user-1', { status: 'active' });

      expect(mockPrisma.mealPlan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1', status: 'active' }),
        }),
      );
    });
  });

  // ==========================================
  // MP-003: Get Meal Plan Detail
  // ==========================================
  describe('getMealPlan', () => {
    it('should return meal plan with items', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({
        id: 'plan-1',
        userId: 'user-1',
        items: [
          { id: 'slot-1', day: 1, mealType: 'breakfast', recipe: { name: 'Phở' } },
        ],
      });

      const result = await service.getMealPlan('user-1', 'plan-1');

      expect(result.id).toBe('plan-1');
      expect(result.items).toHaveLength(1);
    });

    it('should throw ResourceNotFoundException for non-existent plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue(null);

      await expect(
        service.getMealPlan('user-1', 'nonexistent'),
      ).rejects.toThrow('Meal plan không tìm thấy');
    });
  });

  // ==========================================
  // MP-003: Update Status
  // ==========================================
  describe('updateMealPlanStatus', () => {
    it('should update status successfully', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1', userId: 'user-1' });
      mockPrisma.mealPlan.update.mockResolvedValue({ id: 'plan-1', status: 'archived' });

      const result = await service.updateMealPlanStatus('user-1', 'plan-1', 'archived');
      expect(result.status).toBe('archived');
    });

    it('should archive other active plans when activating', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1', userId: 'user-1' });
      mockPrisma.mealPlan.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.mealPlan.update.mockResolvedValue({ id: 'plan-1', status: 'active' });

      await service.updateMealPlanStatus('user-1', 'plan-1', 'active');

      expect(mockPrisma.mealPlan.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: 'active', id: { not: 'plan-1' } },
        data: { status: 'archived' },
      });
    });

    it('should throw ResourceNotFoundException for non-existent plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue(null);

      await expect(
        service.updateMealPlanStatus('user-1', 'nonexistent', 'active'),
      ).rejects.toThrow('Meal plan không tìm thấy');
    });
  });

  // ==========================================
  // MP-004: Swap recipe in slot
  // ==========================================
  describe('swapSlotRecipe', () => {
    it('should swap recipe in a slot', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.mealPlanItem.findFirst.mockResolvedValue({ id: 'slot-1', planId: 'plan-1' });
      mockPrisma.mealPlanItem.update.mockResolvedValue({
        id: 'slot-1', recipeId: 'new-recipe', recipe: { id: 'new-recipe', name: 'Bún bò' },
      });

      const result = await service.swapSlotRecipe('user-1', 'plan-1', 'slot-1', 'new-recipe');
      expect(result.recipeId).toBe('new-recipe');
    });

    it('should throw 404 if plan not found', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue(null);

      await expect(
        service.swapSlotRecipe('user-1', 'nope', 'slot-1', 'recipe-1'),
      ).rejects.toThrow('Meal plan không tìm thấy');
    });

    it('should throw 404 if slot not found', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.mealPlanItem.findFirst.mockResolvedValue(null);

      await expect(
        service.swapSlotRecipe('user-1', 'plan-1', 'nope', 'recipe-1'),
      ).rejects.toThrow('Slot không tìm thấy');
    });
  });

  // ==========================================
  // MP-004: Toggle slot lock
  // ==========================================
  describe('toggleSlotLock', () => {
    it('should lock a slot', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.mealPlanItem.count
        .mockResolvedValueOnce(21)  // total
        .mockResolvedValueOnce(10); // currently locked
      mockPrisma.mealPlanItem.update.mockResolvedValue({ id: 'slot-1', isLocked: true });

      const result = await service.toggleSlotLock('user-1', 'plan-1', 'slot-1', true);
      expect(result.isLocked).toBe(true);
    });

    it('should throw LockLimitException when >70% would be locked', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.mealPlanItem.count
        .mockResolvedValueOnce(21)  // total
        .mockResolvedValueOnce(14); // 14 locked + 1 = 15/21 = 71% > 70%

      await expect(
        service.toggleSlotLock('user-1', 'plan-1', 'slot-1', true),
      ).rejects.toThrow('Không thể lock quá 70% slots');
    });
  });

  // ==========================================
  // G4: Delete Meal Plan
  // ==========================================
  describe('deleteMealPlan', () => {
    it('should delete a draft meal plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1', status: 'draft' });
      mockPrisma.mealPlan.delete.mockResolvedValue({});

      await expect(service.deleteMealPlan('user-1', 'plan-1')).resolves.not.toThrow();
    });

    it('should delete an archived meal plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1', status: 'archived' });
      mockPrisma.mealPlan.delete.mockResolvedValue({});

      await expect(service.deleteMealPlan('user-1', 'plan-1')).resolves.not.toThrow();
    });

    it('should throw CannotDeleteActivePlanException for active plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1', status: 'active' });

      await expect(
        service.deleteMealPlan('user-1', 'plan-1'),
      ).rejects.toThrow('Không thể xóa thực đơn đang hoạt động');
    });

    it('should throw ResourceNotFoundException for non-existent plan', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteMealPlan('user-1', 'nonexistent'),
      ).rejects.toThrow('Meal plan không tìm thấy');
    });
  });

  // ==========================================
  // G17: Revoke share
  // ==========================================
  describe('revokeShare', () => {
    it('should revoke a share successfully', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.mealPlanShare.findFirst.mockResolvedValue({ id: 'share-1', planId: 'plan-1' });
      mockPrisma.mealPlanShare.delete.mockResolvedValue({});

      await expect(service.revokeShare('user-1', 'plan-1', 'share-1')).resolves.not.toThrow();
    });

    it('should throw 404 if share not found', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.mealPlanShare.findFirst.mockResolvedValue(null);

      await expect(
        service.revokeShare('user-1', 'plan-1', 'nonexistent'),
      ).rejects.toThrow('Share không tìm thấy');
    });
  });

  // ==========================================
  // G18: List shares
  // ==========================================
  describe('listShares', () => {
    it('should return shares list', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.mealPlanShare.findMany.mockResolvedValue([
        { id: 'share-1', sharedWith: { id: 'u2', name: 'Wife' } },
      ]);

      const result = await service.listShares('user-1', 'plan-1');
      expect(result).toHaveLength(1);
    });
  });
});
