import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiResponseProperty } from "@nestjs/swagger";

export class UserDto{
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly lastName: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly username: string;
  @IsEmail()
  @ApiResponseProperty()
  readonly email: string;
}