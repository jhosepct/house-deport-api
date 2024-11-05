import { WarehouseDto } from './warehouse.dto';
import { ProductBasicDto } from './ProductBasicDto';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiResponse, ApiResponseProperty } from '@nestjs/swagger';

class WarehouseBasicDto {
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
}

export class ProductWarehouseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly warehouse: WarehouseBasicDto;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly product: ProductBasicDto;
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
}
