import { Controller, Get, Post, Patch, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
export class ShoppingListController {
  constructor(private shoppingListService: ShoppingListService) {}

  // G6: Generate shopping list from meal plan
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generate(
    @CurrentUser('sub') userId: string,
    @Body() body: { mealPlanId: string },
  ) {
    return this.shoppingListService.generate(userId, body.mealPlanId);
  }

  // G7: List all shopping lists
  @Get()
  async list(@CurrentUser('sub') userId: string) {
    return this.shoppingListService.listByUser(userId);
  }

  // G7: Get shopping list by ID
  @Get(':id')
  async getById(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.shoppingListService.getById(userId, id);
  }

  // G8: Toggle item checked status
  @Patch(':id/items/:itemId')
  async toggleItem(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: { checked: boolean },
  ) {
    return this.shoppingListService.toggleItem(userId, id, itemId, body.checked);
  }
}
