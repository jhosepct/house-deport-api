import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;
}
