import { IsOptional, Validate } from "class-validator";
import { Gender } from "../../utils/enum/gender.enum";
import { toGender } from "src/utils/validation/gender";
import { User } from "../user.entity";

export class UpdateUserDto {
    
    @IsOptional()
    readonly firstName?: string;
    @IsOptional()
    readonly lastName?: string;
    @IsOptional()
    readonly phone?: string;
    @IsOptional()
    @Validate(toGender)
    readonly gender?: Gender;
}