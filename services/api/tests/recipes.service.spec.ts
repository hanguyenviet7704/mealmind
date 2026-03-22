import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from '../src/modules/recipes/recipes.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('RecipesService', () => {
  let service: RecipesService;

  const mockPrisma = {
    recipe: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    bookmark: {
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    jest.clearAllMocks();
  });

  // ==========================================
  // RD-001: List Recipes
  // ==========================================
  describe('listRecipes', () => {
    it('should return paginated recipes with default params', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([
        {
          id: 'r1', name: 'Phở bò', imageUrl: '/pho.jpg', description: 'Phở truyền thống',
          cuisine: 'north', difficulty: 'medium', prepTime: 30, cookTime: 60,
          servings: 4, mealTypes: ['lunch'],
          nutritionInfo: { calories: '450', protein: '25', carbs: '60', fat: '12' },
        },
      ]);
      mockPrisma.recipe.count.mockResolvedValue(1);

      const result = await service.listRecipes({});

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Phở bò');
      expect(result.data[0].totalTime).toBe(90); // 30 + 60
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(20);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by cuisine', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([]);
      mockPrisma.recipe.count.mockResolvedValue(0);

      await service.listRecipes({ cuisine: 'north' });

      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ cuisine: 'north', isPublished: true }),
        }),
      );
    });

    it('should filter by maxCookTime', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([]);
      mockPrisma.recipe.count.mockResolvedValue(0);

      await service.listRecipes({ maxCookTime: 15 });

      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ cookTime: { lte: 15 } }),
        }),
      );
    });

    it('should filter by difficulty', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([]);
      mockPrisma.recipe.count.mockResolvedValue(0);

      await service.listRecipes({ difficulty: 'easy' });

      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ difficulty: 'easy' }),
        }),
      );
    });

    it('should sort by cookTime ascending', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([]);
      mockPrisma.recipe.count.mockResolvedValue(0);

      await service.listRecipes({ sortBy: 'cookTime', sortOrder: 'asc' });

      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { cookTime: 'asc' } }),
      );
    });

    it('should paginate correctly with page 2', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([]);
      mockPrisma.recipe.count.mockResolvedValue(25);

      const result = await service.listRecipes({ page: 2, pageSize: 10 });

      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
      expect(result.meta.page).toBe(2);
      expect(result.meta.totalPages).toBe(3);
    });
  });

  // ==========================================
  // RD-002: Recipe Detail
  // ==========================================
  describe('getRecipeDetail', () => {
    const mockRecipe = {
      id: 'r1',
      name: 'Phở bò',
      imageUrl: '/pho.jpg',
      description: 'Phở',
      cuisine: 'north',
      difficulty: 'medium',
      prepTime: 30,
      cookTime: 60,
      servings: 4,
      mealTypes: ['lunch'],
      videoUrl: null,
      tags: ['truyền thống'],
      ingredients: [
        {
          ingredient: { id: 'i1', name: 'Bánh phở' },
          quantity: '400', unit: 'gram',
          groupType: 'main', sortOrder: 1, isOptional: false,
        },
        {
          ingredient: { id: 'i2', name: 'Thịt bò' },
          quantity: '300', unit: 'gram',
          groupType: 'main', sortOrder: 2, isOptional: false,
        },
      ],
      steps: [
        { stepNumber: 1, description: 'Nấu nước dùng', imageUrl: null, durationMinutes: 45 },
        { stepNumber: 2, description: 'Trụng bánh phở', imageUrl: null, durationMinutes: 2 },
      ],
      nutritionInfo: {
        calories: '450', protein: '25', carbs: '60', fat: '12',
        fiber: '3', sodium: '800',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return full recipe detail with default servings', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);

      const result = await service.getRecipeDetail('r1');

      expect(result.id).toBe('r1');
      expect(result.name).toBe('Phở bò');
      expect(result.totalTime).toBe(90);
      expect(result.defaultServings).toBe(4);
      expect(result.requestedServings).toBe(4);
      expect(result.ingredients).toHaveLength(2);
      expect(result.steps).toHaveLength(2);
      expect(result.nutrition?.calories).toBe(450);
    });

    it('should scale ingredients when servings param provided (RD-003)', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);

      const result = await service.getRecipeDetail('r1', 2); // half

      // 400 * (2/4) = 200
      expect(result.ingredients[0].quantity).toBe(200);
      // 300 * (2/4) = 150
      expect(result.ingredients[1].quantity).toBe(150);
      expect(result.requestedServings).toBe(2);
    });

    it('should scale up ingredients correctly', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);

      const result = await service.getRecipeDetail('r1', 8); // double

      // 400 * (8/4) = 800
      expect(result.ingredients[0].quantity).toBe(800);
    });

    it('should throw ResourceNotFoundException for non-existent recipe (404)', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(null);

      await expect(service.getRecipeDetail('nonexistent')).rejects.toThrow(
        'Recipe không tìm thấy',
      );
    });

    it('should check bookmark status when userId provided', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      mockPrisma.bookmark.findUnique.mockResolvedValue({ id: 'b1' });

      const result = await service.getRecipeDetail('r1', undefined, 'user-1');

      expect(result.isBookmarked).toBe(true);
    });

    it('should return isBookmarked false when not bookmarked', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      mockPrisma.bookmark.findUnique.mockResolvedValue(null);

      const result = await service.getRecipeDetail('r1', undefined, 'user-1');

      expect(result.isBookmarked).toBe(false);
    });
  });

  // ==========================================
  // RD-004: Bookmarks
  // ==========================================
  describe('bookmarkRecipe', () => {
    it('should create a bookmark successfully (201)', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue({ id: 'r1' });
      mockPrisma.bookmark.create.mockResolvedValue({ id: 'b1', userId: 'u1', recipeId: 'r1' });

      const result = await service.bookmarkRecipe('u1', 'r1');
      expect(result.id).toBe('b1');
    });

    it('should throw ResourceNotFoundException if recipe not found (404)', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(null);

      await expect(service.bookmarkRecipe('u1', 'nonexistent')).rejects.toThrow(
        'Recipe không tìm thấy',
      );
    });

    it('should throw ResourceConflictException if already bookmarked (409)', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue({ id: 'r1' });
      mockPrisma.bookmark.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.bookmarkRecipe('u1', 'r1')).rejects.toThrow(
        'Bookmark đã tồn tại',
      );
    });
  });

  describe('removeBookmark', () => {
    it('should delete bookmark successfully (204)', async () => {
      mockPrisma.bookmark.delete.mockResolvedValue({});

      await expect(service.removeBookmark('u1', 'r1')).resolves.not.toThrow();
    });

    it('should throw ResourceNotFoundException if bookmark not found (404)', async () => {
      mockPrisma.bookmark.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.removeBookmark('u1', 'nonexistent')).rejects.toThrow(
        'Bookmark không tìm thấy',
      );
    });
  });

  describe('getBookmarkedRecipes', () => {
    it('should return paginated bookmarks', async () => {
      mockPrisma.bookmark.findMany.mockResolvedValue([
        {
          recipe: {
            id: 'r1', name: 'Phở', imageUrl: '/pho.jpg', description: 'Truyền thống',
            cuisine: 'north', difficulty: 'medium', prepTime: 30, cookTime: 60,
            servings: 4, mealTypes: ['lunch'],
            nutritionInfo: { calories: '450' },
          },
        },
      ]);
      mockPrisma.bookmark.count.mockResolvedValue(1);

      const result = await service.getBookmarkedRecipes('u1', {});

      expect(result.data).toHaveLength(1);
      expect(result.data[0].isBookmarked).toBe(true);
    });

    it('should filter bookmarks by cuisine', async () => {
      mockPrisma.bookmark.findMany.mockResolvedValue([]);
      mockPrisma.bookmark.count.mockResolvedValue(0);

      await service.getBookmarkedRecipes('u1', { cuisine: 'north' });

      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'u1',
            recipe: expect.objectContaining({ cuisine: 'north' }),
          }),
        }),
      );
    });

    it('should support search within bookmarks', async () => {
      mockPrisma.bookmark.findMany.mockResolvedValue([]);
      mockPrisma.bookmark.count.mockResolvedValue(0);

      await service.getBookmarkedRecipes('u1', { q: 'phở' });

      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            recipe: expect.objectContaining({
              OR: expect.any(Array),
            }),
          }),
        }),
      );
    });
  });
});
