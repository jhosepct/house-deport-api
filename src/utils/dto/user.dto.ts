import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
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
  @IsString()
  @ApiResponseProperty()
  readonly gender: string;
  @IsString()
  @ApiResponseProperty()
  readonly lastSession?: Date;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly created_at : Date;
  @IsDate()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly updated_at : Date;

}