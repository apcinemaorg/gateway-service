import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString, Length, Matches, Validate } from "class-validator"
import { IdentifierValidator } from "src/shared/validators/identifier.validator"

export class VerifyOtpRequest {
    @ApiProperty({
        description: 'The identifier of the user',
        examples: ['+421950353687', 'test@example.com'],
    })
    @IsString()
    @Validate(IdentifierValidator)
    public identifier: string

    @ApiProperty({
        description: 'The OTP code',
        examples: ['123456'],
    })
    @IsString()
    @Length(6, 6, { message: 'OTP code must be exactly 6 characters' })
    @Matches(/^\d{6}$/, { message: 'OTP code must contain only digits' })
    public code: string

    @ApiProperty({
        description: 'The type of the identifier',
        enum: ['phone', 'email'],
        examples: ['phone', 'email'],
    })
    @IsEnum(['phone', 'email'])
    public type: 'phone' | 'email'
}
