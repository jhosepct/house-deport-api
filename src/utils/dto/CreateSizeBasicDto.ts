import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSizeBasicDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  sizeId: number;
}