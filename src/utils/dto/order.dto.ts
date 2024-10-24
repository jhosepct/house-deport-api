import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { ApiResponseProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { SizeDto } from './size.dto';
import { UserDto } from './user.dto';
import { ClientDto } from './client.dto';
import { ProductDto } from './product.dto';
import { ApiProperty } from "@nestjs/swagger";

class ProductBasicDto {
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
}

class DetailDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly product: ProductBasicDto;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly quantity: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly unitPrice: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly total: number;
}

export class OrderDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly numFac: String;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly user: UserDto;
  @IsObject()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly client: ClientDto;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly date: Date;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly subtotal: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly total: number;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: DetailDto,
    isArray: true
  })
  readonly details: DetailDto[];
}
