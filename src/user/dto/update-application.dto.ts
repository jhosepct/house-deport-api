import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length, Validate } from "class-validator";
import { Gender } from "../../utils/enum/gender.enum";
import { toGender } from "src/utils/validation/gender";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateHoraryDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly job_id: number;
}

export class UpdatePayDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly application_id: number;
}