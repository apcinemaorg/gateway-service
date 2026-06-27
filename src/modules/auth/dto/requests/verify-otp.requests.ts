import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNumber, IsString, Validate } from "class-validator"
import { IdentifierValidator } from "src/shared/validators/identifier.validator"

export class VerifyOtpRequest {
    @ApiProperty({
        description: 'The identifier of the user',
        examples: ['+421950353687', 'test@example.com'],
    })
    @ApiProperty({
        description: 'The code of the OTP',
        examples: ['123456'],
    })
    @IsString()
    @Validate(IdentifierValidator)
    public otp: string
    @ApiProperty({
        description: 'The type of the identifier',
        enum: ['phone', 'email'],
        examples: ['phone', 'email'],
    })
    @IsEnum(['phone', 'email'])
    public type: 'phone' | 'email'
}