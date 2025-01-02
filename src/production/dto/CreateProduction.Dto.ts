import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductionDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly quantity: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly user_orderId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly productId: number;
}
