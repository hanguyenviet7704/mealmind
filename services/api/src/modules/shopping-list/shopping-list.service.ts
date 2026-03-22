import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ResourceNotFoundException } from '@/common/exceptions';

@Injectable()
export class ShoppingListService {
  constructor(private prisma: PrismaService) {}

  // G6: Generate shopping list from meal plan
  async generate(userId: string, planId: string) {
    const plan = await this.prisma.mealPlan.findFirst({
      where: { id: planId, userId },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: { ingredient: true },
                },
              },
            },
          },
        },
      },
    });

    if (!plan) throw new ResourceNotFoundException('Meal plan');

    // Aggregate ingredients across all recipes
    const ingredientMap = new Map<string, {
      name: string;
      quantity: number;
      unit: string;
      category: string;
    }>();

    for (const item of plan.items) {
      for (const ri of item.recipe.ingredients) {
        const key = `${ri.ingredient.name}_${ri.unit}`;
        const existing = ingredientMap.get(key);
        if (existing) {
          existing.quantity += Number(ri.quantity);
        } else {
          ingredientMap.set(key, {
            name: ri.ingredient.name,
            quantity: Number(ri.quantity),
            unit: ri.unit,
            category: ri.ingredient.category,
          });
        }
      }
    }

    // Format week label
    const weekStart = new Date(plan.weekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekLabel = `${weekStart.getDate().toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')} – ${weekEnd.getDate().toString().padStart(2, '0')}/${(weekEnd.getMonth() + 1).toString().padStart(2, '0')}`;

    // Create shopping list
    const shoppingList = await this.prisma.shoppingList.create({
      data: {
        userId,
        planId,
        weekLabel,
        items: {
          create: Array.from(ingredientMap.values()).map((item, index) => ({
            ingredientName: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category as any,
            sortOrder: index,
          })),
        },
      },
      include: {
        items: {
          orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
        },
      },
    });

    return shoppingList;
  }

  // G7: Get shopping list by ID
  async getById(userId: string, listId: string) {
    const list = await this.prisma.shoppingList.findFirst({
      where: { id: listId, userId },
      include: {
        items: {
          orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!list) throw new ResourceNotFoundException('Shopping list');
    return list;
  }

  // G7b: List all shopping lists for user
  async listByUser(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { items: true } },
      },
    });
  }

  // G8: Toggle shopping list item
  async toggleItem(userId: string, listId: string, itemId: string, checked: boolean) {
    const list = await this.prisma.shoppingList.findFirst({
      where: { id: listId, userId },
    });
    if (!list) throw new ResourceNotFoundException('Shopping list');

    return this.prisma.shoppingListItem.update({
      where: { id: itemId },
      data: { checked },
    });
  }
}
