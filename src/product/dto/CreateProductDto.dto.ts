import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

class LocationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly row: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly column: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly warehouseId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number;
}

export class CreateProductDtoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly code: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly price: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly categoryId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly sizeId: number;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: LocationDto,
    isArray: true
  })
  readonly location: LocationDto[];
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly stockInventory: number;
}
