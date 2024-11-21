import { IsArray, IsOptional, IsString } from "class-validator";
import {  ApiPropertyOptional } from "@nestjs/swagger";
import { CreateSizeBasicDto } from "../../utils/dto/CreateSizeBasicDto";

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly name?: string;
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: CreateSizeBasicDto,
    isArray: true
  })
  readonly sizes?: CreateSizeBasicDto[];
}
