import { IsDate, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiResponseProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { UserDto } from './user.dto';
import { ProductDto } from './product.dto';

class ProductionDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;

  @IsNotEmpty()
  @ApiResponseProperty()
  readonly status: string;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly user_order: UserDto;

  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly quantity: number;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly product: ProductDto;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly created_at: Date;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly updated_at: Date;
}
