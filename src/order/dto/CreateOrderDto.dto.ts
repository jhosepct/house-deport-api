import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";

class ProductBasicCreateDto{
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number;
}

export class CreateOrderDto{
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly numFac: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly clientId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly userId: number;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: ProductBasicCreateDto,
    isArray: true
  })
  readonly products: ProductBasicCreateDto[];
}

