import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly rowMax: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly columnMax: number;
}