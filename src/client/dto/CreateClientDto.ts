  import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lastName: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly phone: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly email: string;
  @IsString()
  @IsOptional()
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
