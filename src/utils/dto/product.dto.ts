import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { CategoryDto } from './category.dto';
import { SizeDto } from './size.dto';
import { ApiResponseProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

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
  @IsArray()
  @IsNotEmpty()
  @ApiResponseProperty({
    type: CategoryDto
  })
  readonly category: CategoryDto[];
  @IsArray()
  @IsNotEmpty()
  @ApiResponseProperty({
    type: SizeDto
  })
  readonly size: SizeDto[];
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly stockInventory: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly stockStore: number;
}
