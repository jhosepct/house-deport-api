import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class SizeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly name: string;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly created_at : Date;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly updated_at : Date;
}