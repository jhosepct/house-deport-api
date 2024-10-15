import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDtoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}