import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @IsNumber()
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
  readonly phone: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly address: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly numberDocument: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly typeDocument: string;
}
