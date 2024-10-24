import { IsOptional, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly name: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly code: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly price: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly categoryId: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly sizeId: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly stockInventory: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly stockStore: number;
}