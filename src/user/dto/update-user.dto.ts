import { IsOptional, IsString, Validate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly firstName: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly lastName: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly password: string;
}
