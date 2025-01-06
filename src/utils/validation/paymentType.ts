import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PaymentType } from "../enum/paymentType.enum";

@ValidatorConstraint({ name: 'toPaymentType', async: false })
export class toPaymentType implements ValidatorConstraintInterface {
    validate(value: String, _validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if (value === undefined) return false;
        const newValue = value.toUpperCase();
        return newValue === PaymentType.YAPE || newValue === PaymentType.TRANSFERS || newValue === PaymentType.CASH;
    }
    defaultMessage?(_validationArguments?: ValidationArguments): string {
        return 'Please enter a valid PaymentType value'
    }

}