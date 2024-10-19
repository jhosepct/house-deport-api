import { IsEmail, MinLength, MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    readonly email: string;
    @ApiProperty()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;
}
export class LoginWithUsernameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly username: string;
    @ApiProperty()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;
}