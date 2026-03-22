import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListService } from '../src/modules/shopping-list/shopping-list.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('ShoppingListService', () => {
  let service: ShoppingListService;

  const mockPrisma = {
    mealPlan: {
      findFirst: jest.fn(),
    },
    shoppingList: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    shoppingListItem: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ShoppingListService>(ShoppingListService);
    jest.clearAllMocks();
  });

  // ==========================================
  // G6: Generate Shopping List
  // ==========================================
  describe('generate', () => {
    it('should aggregate ingredients from meal plan recipes', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue({
        id: 'plan-1',
        userId: 'user-1',
        weekStart: new Date('2026-03-23'),
        items: [
          {
            recipe: {
              ingredients: [
                { ingredient: { name: 'Gạo', category: 'grain' }, quantity: '200', unit: 'gram' },
                { ingredient: { name: 'Thịt bò', category: 'meat' }, quantity: '300', unit: 'gram' },
              ],
            },
          },
          {
            recipe: {
              ingredients: [
                { ingredient: { name: 'Gạo', category: 'grain' }, quantity: '200', unit: 'gram' },
                { ingredient: { name: 'Cà chua', category: 'vegetable' }, quantity: '150', unit: 'gram' },
              ],
            },
          },
        ],
      });

      const expectedList = {
        id: 'sl-1',
        userId: 'user-1',
        planId: 'plan-1',
        weekLabel: '23/03 – 29/03',
        items: [
          { ingredientName: 'Gạo', quantity: 400, unit: 'gram', category: 'grain', checked: false },
          { ingredientName: 'Thịt bò', quantity: 300, unit: 'gram', category: 'meat', checked: false },
          { ingredientName: 'Cà chua', quantity: 150, unit: 'gram', category: 'vegetable', checked: false },
        ],
      };
      mockPrisma.shoppingList.create.mockResolvedValue(expectedList);

      const result = await service.generate('user-1', 'plan-1');

      expect(result.items).toHaveLength(3);
      // Gạo should be aggregated: 200 + 200 = 400
      expect(mockPrisma.shoppingList.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            planId: 'plan-1',
          }),
        }),
      );
    });

    it('should throw ResourceNotFoundException if meal plan not found', async () => {
      mockPrisma.mealPlan.findFirst.mockResolvedValue(null);

      await expect(
        service.generate('user-1', 'nonexistent'),
      ).rejects.toThrow('Meal plan không tìm thấy');
    });
  });

  // ==========================================
  // G7: Get Shopping List
  // ==========================================
  describe('getById', () => {
    it('should return shopping list with items', async () => {
      mockPrisma.shoppingList.findFirst.mockResolvedValue({
        id: 'sl-1',
        userId: 'user-1',
        items: [
          { id: 'item-1', ingredientName: 'Gạo', quantity: 400, checked: false },
        ],
      });

      const result = await service.getById('user-1', 'sl-1');
      expect(result.items).toHaveLength(1);
    });

    it('should throw ResourceNotFoundException for invalid id', async () => {
      mockPrisma.shoppingList.findFirst.mockResolvedValue(null);

      await expect(
        service.getById('user-1', 'nonexistent'),
      ).rejects.toThrow('Shopping list không tìm thấy');
    });
  });

  // ==========================================
  // G7b: List shopping lists
  // ==========================================
  describe('listByUser', () => {
    it('should return user shopping lists', async () => {
      mockPrisma.shoppingList.findMany.mockResolvedValue([
        { id: 'sl-1', weekLabel: '23/03 – 29/03', _count: { items: 15 } },
      ]);

      const result = await service.listByUser('user-1');
      expect(result).toHaveLength(1);
    });
  });

  // ==========================================
  // G8: Toggle item
  // ==========================================
  describe('toggleItem', () => {
    it('should toggle item checked status', async () => {
      mockPrisma.shoppingList.findFirst.mockResolvedValue({ id: 'sl-1' });
      mockPrisma.shoppingListItem.update.mockResolvedValue({
        id: 'item-1', checked: true,
      });

      const result = await service.toggleItem('user-1', 'sl-1', 'item-1', true);
      expect(result.checked).toBe(true);
    });

    it('should throw if shopping list not found', async () => {
      mockPrisma.shoppingList.findFirst.mockResolvedValue(null);

      await expect(
        service.toggleItem('user-1', 'nope', 'item-1', true),
      ).rejects.toThrow('Shopping list không tìm thấy');
    });
  });
});
