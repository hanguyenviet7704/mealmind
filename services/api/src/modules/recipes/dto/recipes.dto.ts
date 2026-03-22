import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class RecipesFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Lọc theo ẩm thực (VD: Vietnamese, Thai)', example: 'Vietnamese' })
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiPropertyOptional({ description: 'Lọc theo loại bữa ăn (VD: breakfast, lunch, dinner)', example: 'dinner' })
  @IsOptional()
  @IsString()
  mealType?: string;

  @ApiPropertyOptional({ description: 'Lọc theo độ khó (easy, medium, hard)', example: 'easy' })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional({ description: 'Thời gian nấu tối đa (phút)', example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxCookTime?: number;

  @ApiPropertyOptional({ description: 'Trường muốn sắp xếp (VD: cookTime, id)', example: 'cookTime' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp (asc, desc)', example: 'asc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class BookmarkFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm trong danh sách đã lưu', example: 'Gà' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ẩm thực' })
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiPropertyOptional({ description: 'Lọc theo loại bữa ăn' })
  @IsOptional()
  @IsString()
  mealType?: string;
}

export class GenerateComboDto {
  @ApiPropertyOptional({ description: 'Số lượng khẩu phần ăn', default: 2, example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  servings?: number;
}
