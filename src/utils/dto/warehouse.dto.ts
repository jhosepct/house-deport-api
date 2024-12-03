import {
  IsArray, IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString
} from "class-validator";
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class ProductBasicWithLocationDto {
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
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly quantity: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly row: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly column: number;
}

export class WarehouseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly rowMax: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly columnMax: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly status: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly description: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly color: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly spaces: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly spacesUsed: number;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: ProductBasicWithLocationDto,
    isArray: true,
  })
  readonly products: ProductBasicWithLocationDto[];
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly created_at : Date;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly updated_at : Date;
}
