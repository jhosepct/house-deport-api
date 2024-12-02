import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Role } from "../enum/roles.enum";
@ValidatorConstraint({ name: 'toRole', async: false })
export class toRole implements ValidatorConstraintInterface {
    validate(value: String, _validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if (value === undefined) return false;
        const newValue = value.toLowerCase();
        const allRoles = Role.All.split(',');

        return allRoles.includes(newValue)
    }
    defaultMessage?(_validationArguments?: ValidationArguments): string {
        return 'Please enter a valid role';
    }

}