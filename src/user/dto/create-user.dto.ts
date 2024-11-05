import { IsEmail, IsNotEmpty, IsString, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { toGender } from "../../utils/validation/gender";
import { Gender } from "../../utils/enum/gender.enum";
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly firstName: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly lastName: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly username: string;
    @IsEmail()
    @ApiProperty()
    readonly email: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
    @IsString()
    @IsNotEmpty()
    @Validate(toGender)
    @ApiProperty()
    readonly gender: Gender;
}