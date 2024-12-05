import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { toRole } from '../validation/role';
import { Role } from '../enum/roles.enum';

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
  @IsNotEmpty()
  @ApiProperty()
  readonly role: string;
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