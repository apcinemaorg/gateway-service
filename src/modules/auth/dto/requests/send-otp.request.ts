import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString, Validate } from "class-validator"
import { IdentifierValidator } from "src/shared/validators/identifier.validator"

export class SendOtpRequest {
    @ApiProperty({
        description: 'The identifier of the user',
        examples: ['+421950353687', 'test@example.com'],
    })
    @IsString()
    @Validate(IdentifierValidator)
    public identifier: string
    @ApiProperty({
        description: 'The type of the identifier',
        enum: ['phone', 'email'],
        examples: ['phone', 'email'],
    })
    @IsEnum(['phone', 'email'])
    public type: 'phone' | 'email'
}