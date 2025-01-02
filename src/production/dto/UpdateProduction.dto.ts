import { IsNumber, IsPositive, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductionDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional()
  readonly user_receive_orderId?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsIn(['pending', 'completed', 'canceled'])
  readonly status?: string;
}
