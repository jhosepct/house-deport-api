import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Gender } from "../enum/gender.enum";

@ValidatorConstraint({ name: 'toGender', async: false })
export class toGender implements ValidatorConstraintInterface {
    validate(value: String, _validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if (value === undefined) return false;
        const newValue = value.toUpperCase();
        return newValue === Gender.FEMALE || newValue === Gender.MALE || newValue === Gender.NOTBINARY || newValue === Gender.OTHER;
    }
    defaultMessage?(_validationArguments?: ValidationArguments): string {
        return 'Please enter a valid gender value'
    }

}