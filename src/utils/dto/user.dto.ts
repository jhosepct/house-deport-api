import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto{
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lastName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;
  @IsEmail()
  @ApiProperty()
  readonly email: string;
}