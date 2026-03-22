import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateMealPlanDto, ListMealPlansQueryDto, UpdateMealPlanStatusDto, SwapSlotDto, ShareMealPlanDto } from './dto/meal-plans.dto';

@ApiTags('planning')
@ApiBearerAuth()
@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlansController {
  constructor(private mealPlansService: MealPlansService) {}

  // MP-001
  @Post()
  @ApiOperation({ summary: 'Tạo thực đơn', description: 'Tạo một thực đơn tuần mới (bao gồm các ngày, mỗi ngày gồm các món).' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('sub') userId: string,
    @Body() body: CreateMealPlanDto,
  ) {
    return this.mealPlansService.createMealPlan(userId, body);
  }

  // MP-003
  @Get()
  @ApiOperation({ summary: 'Danh sách thực đơn', description: 'Lấy danh sách các thực đơn đã lên plan.' })
  async list(@CurrentUser('sub') userId: string, @Query() query: ListMealPlansQueryDto) {
    return this.mealPlansService.listMealPlans(userId, {
      status: query.status,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  // MP-003
  @Get(':planId')
  @ApiOperation({ summary: 'Chi tiết thực đơn', description: 'Lấy cấu trúc thực đơn cùng món ăn từng ngày.' })
  @ApiParam({ name: 'planId', description: 'ID thực đơn' })
  async detail(@CurrentUser('sub') userId: string, @Param('planId') planId: string) {
    return this.mealPlansService.getMealPlan(userId, planId);
  }

  // MP-003
  @Patch(':planId/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái thực đơn', description: 'Chuyển đổi trạng thái (draft, active, completed).' })
  @ApiParam({ name: 'planId', description: 'ID thực đơn' })
  async updateStatus(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Body() body: UpdateMealPlanStatusDto,
  ) {
    return this.mealPlansService.updateMealPlanStatus(userId, planId, body.status);
  }

  // MP-004: Swap recipe in slot
  @Patch(':planId/slots/:slotId')
  @ApiOperation({ summary: 'Đổi/Khóa món ăn trong thực đơn', description: 'Đổi món ăn ở 1 slot hoặc khóa món ăn đó lại.' })
  @ApiParam({ name: 'planId', description: 'Trị số ID của thực đơn' })
  @ApiParam({ name: 'slotId', description: 'ID slot trong ngày' })
  async swapSlot(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Param('slotId') slotId: string,
    @Body() body: SwapSlotDto,
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
  @ApiOperation({ summary: 'Gợi ý món thay thế', description: 'Lấy các món gợi ý để thay thế slot chỉ định.' })
  @ApiParam({ name: 'planId' })
  @ApiParam({ name: 'slotId' })
  async slotSuggestions(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Param('slotId') slotId: string,
  ) {
    return this.mealPlansService.getSlotSuggestions(userId, planId, slotId);
  }

  // MP-006
  @Post(':planId/regenerate')
  @ApiOperation({ summary: 'Tạo lại thực đơn', description: 'Tính toán lại toàn bộ thực đơn theo profile hiện tại.' })
  @ApiParam({ name: 'planId', description: 'ID thực đơn' })
  async regenerate(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
  ) {
    return this.mealPlansService.regenerate(userId, planId);
  }

  // MP-007
  @Post(':planId/share')
  @ApiOperation({ summary: 'Chia sẻ thực đơn', description: 'Cấp quyền xem/sửa cho thành viên trong gia đình.' })
  @ApiParam({ name: 'planId', description: 'ID thực đơn' })
  async share(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
    @Body() body: ShareMealPlanDto,
  ) {
    return this.mealPlansService.shareMealPlan(userId, planId, body);
  }

  // G4: Delete meal plan
  @Delete(':planId')
  @ApiOperation({ summary: 'Xóa thực đơn', description: 'Xóa môt thực đơn.' })
  @ApiParam({ name: 'planId', description: 'ID thực đơn' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
  ) {
    await this.mealPlansService.deleteMealPlan(userId, planId);
  }

  // G17: Revoke share
  @Delete(':planId/share/:shareId')
  @ApiOperation({ summary: 'Thu hồi quyền chia sẻ', description: 'Gỡ quyền đã cấp cho 1 người.' })
  @ApiParam({ name: 'planId', description: 'ID thực đơn' })
  @ApiParam({ name: 'shareId', description: 'ID cấp phép' })
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
  @ApiOperation({ summary: 'Danh sách chia sẻ', description: 'Theo dõi ai có quyền vào thực đơn này.' })
  @ApiParam({ name: 'planId', description: 'ID thực đơn' })
  async listShares(
    @CurrentUser('sub') userId: string,
    @Param('planId') planId: string,
  ) {
    return this.mealPlansService.listShares(userId, planId);
  }
}

