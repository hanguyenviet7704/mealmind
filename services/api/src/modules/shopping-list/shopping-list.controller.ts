import { Controller, Get, Post, Patch, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GenerateShoppingListDto, ToggleShoppingItemDto } from './dto/shopping-list.dto';

@ApiTags('planning')
@ApiBearerAuth()
@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
export class ShoppingListController {
  constructor(private shoppingListService: ShoppingListService) {}

  // G6: Generate shopping list from meal plan
  @Post('generate')
  @ApiOperation({ summary: 'Tạo danh sách đi chợ', description: 'Gộp nguyên liệu từ thực đơn thành một danh sách mua sắm duy nhất theo phân loại.' })
  @HttpCode(HttpStatus.CREATED)
  async generate(
    @CurrentUser('sub') userId: string,
    @Body() body: GenerateShoppingListDto,
  ) {
    return this.shoppingListService.generate(userId, body.mealPlanId);
  }

  // G7: List all shopping lists
  @Get()
  @ApiOperation({ summary: 'Danh sách đi chợ', description: 'Liệt kê các danh sách mua sắm hiện có.' })
  async list(@CurrentUser('sub') userId: string) {
    return this.shoppingListService.listByUser(userId);
  }

  // G7: Get shopping list by ID
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết danh sách đi chợ', description: 'Lấy các mục cần mua sắm trong danh sách.' })
  @ApiParam({ name: 'id', description: 'ID danh sách mua sắm' })
  async getById(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.shoppingListService.getById(userId, id);
  }

  // G8: Toggle item checked status
  @Patch(':id/items/:itemId')
  @ApiOperation({ summary: 'Đánh dấu mục mua sắm', description: 'Tick/Untick nguyên liệu đã mua.' })
  @ApiParam({ name: 'id', description: 'ID danh sách mua sắm' })
  @ApiParam({ name: 'itemId', description: 'ID mục hàng' })
  async toggleItem(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: ToggleShoppingItemDto,
  ) {
    return this.shoppingListService.toggleItem(userId, id, itemId, body.checked);
  }
}
