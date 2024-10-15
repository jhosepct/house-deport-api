import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseLogout{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly statusCode: number;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message: string;
}

export class Error409 {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly statusCode: number;
}

export class Error400{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly error: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly statusCode: number;
}

export class Error404{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly statusCode: number;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message: string;
}

export class Error500{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly statusCode: number;
}

export class Error401{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly statusCode: number;
}

export class DeleteResponse{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly response: string ;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly status: number;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;
}