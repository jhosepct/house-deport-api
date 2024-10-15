import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDtoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}
