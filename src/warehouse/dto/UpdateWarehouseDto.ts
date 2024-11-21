import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateWarehouseDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly name?: string;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly rowMax?: number;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  readonly columnMax?: number;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly description?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly color?: string;
}