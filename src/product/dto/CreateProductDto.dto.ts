import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly stockInventory: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly stockStore: number;
}
