import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { SizeDto } from "./size.dto";

export class CategoryDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiResponseProperty()
    readonly id: number;
    @IsString()
    @IsNotEmpty()
    @ApiResponseProperty()
    readonly name: string;
    @IsArray()
    @IsOptional()
    @ApiProperty({
        type: SizeDto,
        isArray: true
    })
    readonly sizes: SizeDto[];
    @IsDate()
    @IsNotEmpty()
    @ApiResponseProperty()
    readonly created_at : Date;
    @IsDate()
    @IsNotEmpty()
    @ApiResponseProperty()
    readonly updated_at : Date;
}