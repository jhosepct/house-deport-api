import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateSizeBasicDto } from "../../utils/dto/CreateSizeBasicDto";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: CreateSizeBasicDto,
    isArray: true
  })
  readonly sizes: CreateSizeBasicDto[];
}