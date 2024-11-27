import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductWarehouseDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    row?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    column?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    quantity?: number;
    @ApiProperty({ required: false })
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    warehouseId?: number;
}