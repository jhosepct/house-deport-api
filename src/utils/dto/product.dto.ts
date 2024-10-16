import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { SizeDto } from './size.dto';
import { ApiResponseProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

class CategoryBasicDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly name: string;
}

class ProductWarehouseBasicDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly row: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly column: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly quantity: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly status: string;
}

export class ProductDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly code: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly price: number;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty({
    type: CategoryBasicDto
  })
  readonly category: CategoryBasicDto;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty({
    type: SizeDto
  })
  readonly size: SizeDto;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty({
    type: ProductWarehouseBasicDto
  })
  readonly productWarehouse: ProductWarehouseBasicDto;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly stockInventory: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly stockStore: number;
}

