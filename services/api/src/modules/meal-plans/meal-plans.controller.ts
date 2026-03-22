import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlansController {
  constructor(private mealPlansService: MealPlansService) {}

  // MP-001
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('sub') userId: string,
    @Body() body: any,
  ) {
    return this.mealPlansService.createMealPlan(userId, body);
  }

  // MP-003
  @Get()
  async list(@CurrentUser('sub') userId: string, @Query() query: any) {
    return this.mealPlansService.listMealPlans(userId, {
      status: query.status,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 10,
    });
  }

  // MP-003
  @Get(':planId')
  async detail(@CurrentUser('sub') userId: string, @Param('planId') planId: string) {
    return this.mealPlansService.getMealPlan(userId, planId);
  }

  // MP-003
  @Patch(':planId/status')
  async updateStatus(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Body() body: { status: string },
  ) {
    return this.mealPlansService.updateMealPlanStatus(userId, planId, body.status);
  }

  // MP-004: Swap recipe in slot
  @Patch(':planId/slots/:slotId')
  async swapSlot(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Param('slotId') slotId: string,
    @Body() body: { recipeId?: string; isLocked?: boolean },
  ) {
    if (body.recipeId !== undefined) {
      return this.mealPlansService.swapSlotRecipe(userId, planId, slotId, body.recipeId);
    }
    if (body.isLocked !== undefined) {
      return this.mealPlansService.toggleSlotLock(userId, planId, slotId, body.isLocked);
    }
  }

  // MP-005
  @Get(':planId/slots/:slotId/suggestions')
  async slotSuggestions(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Param('slotId') slotId: string,
  ) {
    return this.mealPlansService.getSlotSuggestions(userId, planId, slotId);
  }

  // MP-006
  @Post(':planId/regenerate')
  async regenerate(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
  ) {
    return this.mealPlansService.regenerate(userId, planId);
  }

  // MP-007
  @Post(':planId/share')
  async share(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Body() body: { userId: string; role: string },
  ) {
    return this.mealPlansService.shareMealPlan(userId, planId, body);
  }

  // G4: Delete meal plan
  @Delete(':planId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
  ) {
    await this.mealPlansService.deleteMealPlan(userId, planId);
  }

  // G17: Revoke share
  @Delete(':planId/share/:shareId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeShare(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Param('shareId') shareId: string,
  ) {
    await this.mealPlansService.revokeShare(userId, planId, shareId);
  }

  // G18: List shares
  @Get(':planId/shares')
  async listShares(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
  ) {
    return this.mealPlansService.listShares(userId, planId);
  }
}

