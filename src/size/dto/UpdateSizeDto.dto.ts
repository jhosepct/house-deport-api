import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSizeDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;
}
