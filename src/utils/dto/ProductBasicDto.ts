import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiResponseProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class ProductBasicDto {
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