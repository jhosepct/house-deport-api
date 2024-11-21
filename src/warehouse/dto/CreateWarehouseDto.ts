import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly description: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly color: string;
}