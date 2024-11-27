import { IsArray, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { toPaymentType } from "../../utils/validation/paymentType";
import { PaymentType } from "../../utils/enum/paymentType.enum";

class ProductBasicCreateDto{
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly productWarehouseId: number;
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
  @IsString()
  @IsNotEmpty()
  @Validate(toPaymentType)
  @ApiProperty()
  readonly paymentType: PaymentType;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: ProductBasicCreateDto,
    isArray: true
  })
  readonly products: ProductBasicCreateDto[];
}

