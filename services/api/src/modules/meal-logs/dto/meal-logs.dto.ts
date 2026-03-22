import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class CreateMealLogDto {
  @ApiProperty({ description: 'ID Công thức nấu ăn' })
  @IsString()
  @IsNotEmpty()
  recipeId!: string;

  @ApiProperty({ description: 'Loại bữa ăn (VD: breakfast, lunch, dinner)' })
  @IsString()
  @IsNotEmpty()
  mealType!: string;

  @ApiPropertyOptional({ description: 'Ngày nấu ăn (mặc định hôm nay)', example: '2024-03-22' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Đánh giá món ăn (1-5 sao)', example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: 'Ghi chú, cảm nghĩ về món ăn' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Hồ sơ người dùng áp dụng cảm nhận này' })
  @IsOptional()
  @IsString()
  profileId?: string;
}

export class ListMealLogsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Thời gian bắt đầu (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Thời gian kết thúc (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Lọc theo bữa ăn' })
  @IsOptional()
  @IsString()
  mealType?: string;
}
