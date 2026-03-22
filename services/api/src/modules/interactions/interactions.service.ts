import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { paginate } from '@/common/dto/pagination.dto';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  // MS-008: Batch create interactions
  async createBatch(userId: string, interactions: Array<{
    recipeId: string;
    action: string;
    source?: string;
    profileId?: string;
  }>) {
    const data = interactions.map((i) => ({
      userId,
      recipeId: i.recipeId,
      action: i.action as any,
      source: (i.source as any) || 'home',
    }));

    await this.prisma.userInteraction.createMany({ data });

    // Update popularity scores
    for (const i of interactions) {
      if (i.action === 'cook' || i.action === 'save') {
        await this.prisma.recipe.update({
          where: { id: i.recipeId },
          data: { popularityScore: { increment: i.action === 'cook' ? 1.0 : 0.5 } },
        });
      }
    }

    return { count: interactions.length };
  }

  // MS-008: Get interaction history
  async getHistory(userId: string, params: {
    action?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { action, page = 1, pageSize = 20 } = params;

    const where: any = { userId };
    if (action) where.action = action;

    const [interactions, total] = await Promise.all([
      this.prisma.userInteraction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          recipe: {
            select: { id: true, name: true, imageUrl: true, cuisine: true },
          },
        },
      }),
      this.prisma.userInteraction.count({ where }),
    ]);

    return paginate(interactions, total, page, pageSize);
  }
}
