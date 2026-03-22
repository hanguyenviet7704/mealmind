import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetSuggestionsDto {
  @ApiPropertyOptional({ description: 'Nội dung tìm kiếm dựa trên Profile ID (nếu có)' })
  @IsOptional()
  @IsString()
  profileId?: string;

  @ApiPropertyOptional({ description: 'Loại bữa ăn cần gợi ý (VD: breakfast, lunch, dinner)' })
  @IsOptional()
  @IsString()
  mealType?: string;

  @ApiPropertyOptional({ description: 'Số lượng gợi ý cần trả về', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  count?: number;
}

export class SwapComboItemDto {
  @ApiProperty({ description: 'Vai trò của món trong combo (main, side, soup)', example: 'main' })
  @IsString()
  role!: string;

  @ApiProperty({ description: 'Loại bữa ăn (bắt buộc để context-aware)', example: 'dinner' })
  @IsString()
  mealType!: string;

  @ApiProperty({ description: 'Danh sách ID các công thức cần loại trừ (không gợi ý lại)', type: [String], example: ['rec_1', 'rec_2'] })
  @IsArray()
  @IsOptional()
  excludeIds?: string[];
}

export class RefreshSuggestionsDto {
  @ApiProperty({ description: 'Danh sách ID các công thức cần loại trừ', type: [String], example: ['rec_1', 'rec_2'] })
  @IsArray()
  @IsOptional()
  excludeIds!: string[];

  @ApiPropertyOptional({ description: 'Loại bữa ăn' })
  @IsOptional()
  @IsString()
  mealType?: string;

  @ApiPropertyOptional({ description: 'Số lượng gửi gợi ý thêm', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  count?: number;

  @ApiPropertyOptional({ description: 'Context Profile ID' })
  @IsOptional()
  @IsString()
  profileId?: string;
}
