import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"
import { SendOtpRequest } from "src/modules/auth/dto/requests/send-otp.request"

@ValidatorConstraint({ name: 'identifierValidator', async: false })
export class IdentifierValidator implements ValidatorConstraintInterface{
    public validate(value: string, args?: ValidationArguments): boolean {
       const object = args?.object as SendOtpRequest

       if(object.type === 'email'){
        return (
            typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        )
       }
       else if(object.type === 'phone'){
        return (
            typeof value === 'string' && /^\+[1-9]\d{6,14}$/.test(value)
        )
       }
       return false
    }

    public defaultMessage(args?: ValidationArguments): string {
        const object = args?.object as SendOtpRequest

        if(object.type === 'email'){
            return 'Email is not valid'
        }
        else if(object.type === 'phone'){
            return 'Phone is not valid'
        }
        return 'Identifier is not valid'
    }
}