import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsService } from '../src/modules/interactions/interactions.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('InteractionsService', () => {
  let service: InteractionsService;

  const mockPrisma = {
    userInteraction: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    recipe: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<InteractionsService>(InteractionsService);
    jest.clearAllMocks();
  });

  // ==========================================
  // MS-008: Create batch interactions
  // ==========================================
  describe('createBatch', () => {
    it('should create multiple interactions in batch', async () => {
      mockPrisma.userInteraction.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.recipe.update.mockResolvedValue({});

      const interactions = [
        { recipeId: 'r1', action: 'view' },
        { recipeId: 'r2', action: 'skip' },
        { recipeId: 'r3', action: 'save' },
      ];

      const result = await service.createBatch('user-1', interactions);

      expect(result.count).toBe(3);
      expect(mockPrisma.userInteraction.createMany).toHaveBeenCalled();
    });

    it('should increment popularity for cook/save actions', async () => {
      mockPrisma.userInteraction.createMany.mockResolvedValue({ count: 2 });
      mockPrisma.recipe.update.mockResolvedValue({});

      const interactions = [
        { recipeId: 'r1', action: 'cook' },
        { recipeId: 'r2', action: 'save' },
      ];

      await service.createBatch('user-1', interactions);

      // cook = +1.0, save = +0.5
      expect(mockPrisma.recipe.update).toHaveBeenCalledTimes(2);
      expect(mockPrisma.recipe.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: { popularityScore: { increment: 1.0 } },
      });
      expect(mockPrisma.recipe.update).toHaveBeenCalledWith({
        where: { id: 'r2' },
        data: { popularityScore: { increment: 0.5 } },
      });
    });

    it('should NOT increment popularity for view/skip actions', async () => {
      mockPrisma.userInteraction.createMany.mockResolvedValue({ count: 2 });

      const interactions = [
        { recipeId: 'r1', action: 'view' },
        { recipeId: 'r2', action: 'skip' },
      ];

      await service.createBatch('user-1', interactions);

      expect(mockPrisma.recipe.update).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // MS-008: Get interaction history
  // ==========================================
  describe('getHistory', () => {
    it('should return paginated history', async () => {
      mockPrisma.userInteraction.findMany.mockResolvedValue([
        {
          id: 'i1', recipeId: 'r1', action: 'view', createdAt: new Date(),
          recipe: { id: 'r1', name: 'Phở bò', imageUrl: '/pho.jpg', cuisine: 'north' },
        },
      ]);
      mockPrisma.userInteraction.count.mockResolvedValue(1);

      const result = await service.getHistory('user-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by action type', async () => {
      mockPrisma.userInteraction.findMany.mockResolvedValue([]);
      mockPrisma.userInteraction.count.mockResolvedValue(0);

      await service.getHistory('user-1', { action: 'save' });

      expect(mockPrisma.userInteraction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ action: 'save' }),
        }),
      );
    });

    it('should paginate correctly', async () => {
      mockPrisma.userInteraction.findMany.mockResolvedValue([]);
      mockPrisma.userInteraction.count.mockResolvedValue(50);

      const result = await service.getHistory('user-1', { page: 3, pageSize: 10 });

      expect(mockPrisma.userInteraction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
      expect(result.meta.page).toBe(3);
    });
  });
});
