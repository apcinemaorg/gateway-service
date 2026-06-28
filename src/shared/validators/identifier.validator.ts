import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { OtpIdentifierRequest } from 'src/modules/auth/dto/requests/otp-identifier.request';

function hasIdentifierType(value: unknown): value is OtpIdentifierRequest {
    if (typeof value !== 'object' || value === null || !('type' in value)) {
        return false;
    }

    const { type } = value;

    return type === 'email' || type === 'phone';
}

@ValidatorConstraint({ name: 'identifierValidator', async: false })
export class IdentifierValidator implements ValidatorConstraintInterface {
    public validate(value: string, args?: ValidationArguments): boolean {
        if (!args || !hasIdentifierType(args.object)) {
            return false;
        }

        if (args.object.type === 'email') {
            return (
                typeof value === 'string' &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            );
        }

        if (args.object.type === 'phone') {
            return (
                typeof value === 'string' && /^\+[1-9]\d{6,14}$/.test(value)
            );
        }

        return false;
    }

    public defaultMessage(args?: ValidationArguments): string {
        if (!args || !hasIdentifierType(args.object)) {
            return 'Identifier is not valid';
        }

        if (args.object.type === 'email') {
            return 'Email is not valid';
        }

        if (args.object.type === 'phone') {
            return 'Phone is not valid';
        }

        return 'Identifier is not valid';
    }
}
