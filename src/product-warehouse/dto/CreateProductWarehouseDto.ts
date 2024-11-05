import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductWarehouseDto{
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly productId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly warehouseId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly row: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly column: number;
}