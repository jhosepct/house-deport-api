import { IsOptional, IsNumber, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly name?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly code?: string;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly price?: number;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly categoryId?: number;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly sizeId?: number;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly stockInventory?: number;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly stockStore?: number;
}