import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiResponseProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { UserDto } from './user.dto';
import { ClientDto } from './client.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductBasicDto } from './ProductBasicDto';
import { Column } from 'typeorm';

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
    isArray: true,
  })
  readonly details: DetailDto[];

  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly paymentType: string;

  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly created_at: Date;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly updated_at: Date;
}
