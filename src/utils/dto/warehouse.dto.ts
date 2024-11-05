import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiResponseProperty } from "@nestjs/swagger";

export class WarehouseDto{
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly id: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly rowMax: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly columnMax: number;
  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  readonly status: string;
}