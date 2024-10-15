import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
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
}