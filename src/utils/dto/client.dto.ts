import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiResponseProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class ClientDto {
  @IsNumber()
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
  readonly phone: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly address: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly numberDocument: string;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly typeDocument: string;
}
