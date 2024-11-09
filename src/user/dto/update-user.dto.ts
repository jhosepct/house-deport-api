import { IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { toGender } from "../../utils/validation/gender";
import { Gender } from "../../utils/enum/gender.enum";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly firstName: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly lastName: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly password: string;
  @IsString()
  @IsNotEmpty()
  @Validate(toGender)
  @ApiProperty()
  readonly gender: Gender;
}
