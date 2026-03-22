import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class SlotItemDto {
  @ApiProperty({ description: 'Loại bữa ăn (VD: breakfast, lunch, dinner)' })
  @IsString()
  @IsNotEmpty()
  mealType!: string;

  @ApiProperty({ description: 'Vai trò (main, side, ...)' })
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiPropertyOptional({ description: 'ID Công thức (nếu đã chọn sẵn)' })
  @IsOptional()
  @IsString()
  recipeId?: string;
}

export class CreateMealPlanDayDto {
  @ApiProperty({ description: 'Ngày lên thực đơn (YYYY-MM-DD)' })
  @IsDateString()
  date!: string;

  @ApiProperty({ type: [SlotItemDto], description: 'Danh sách món ăn/slot' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotItemDto)
  slots!: SlotItemDto[];
}

export class CreateMealPlanDto {
  @ApiProperty({ description: 'Ngày bắt đầu thực đơn (YYYY-MM-DD)' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ description: 'Ngày kết thúc thực đơn (YYYY-MM-DD)' })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ description: 'Hồ sơ gia đình áp dụng (nếu có)' })
  @IsOptional()
  @IsString()
  profileId?: string;

  @ApiProperty({ type: [CreateMealPlanDayDto], description: 'Danh sách các ngày trong thực đơn' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealPlanDayDto)
  days!: CreateMealPlanDayDto[];
}

export class ListMealPlansQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Trạng thái thực đơn (draft, active, completed)', enum: ['draft', 'active', 'completed'] })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateMealPlanStatusDto {
  @ApiProperty({ description: 'Trạng thái mới', enum: ['draft', 'active', 'completed'] })
  @IsEnum(['draft', 'active', 'completed'])
  status!: string;
}

export class SwapSlotDto {
  @ApiPropertyOptional({ description: 'ID thẻ công thức mới để hoán đổi' })
  @IsOptional()
  @IsString()
  recipeId?: string;

  @ApiPropertyOptional({ description: 'Khoá/Mở khoá món ăn' })
  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;
}

export class ShareMealPlanDto {
  @ApiProperty({ description: 'ID người dùng được chia sẻ' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: 'Quyền hạn (viewer, editor)', enum: ['viewer', 'editor'] })
  @IsEnum(['viewer', 'editor'])
  role!: string;
}
