import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class GenerateShoppingListDto {
  @ApiProperty({ description: 'ID của thực đơn (Meal Plan) để tạo danh sách đi chợ' })
  @IsString()
  @IsNotEmpty()
  mealPlanId!: string;
}

export class ToggleShoppingItemDto {
  @ApiProperty({ description: 'Trạng thái tick mua hàng (true = đã mua, false = chưa mua)' })
  @IsBoolean()
  checked!: boolean;
}
