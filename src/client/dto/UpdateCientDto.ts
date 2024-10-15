import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly firstName?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly lastName: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly phone: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly email: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly address: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly numberDocument: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly typeDocument: string;
}
