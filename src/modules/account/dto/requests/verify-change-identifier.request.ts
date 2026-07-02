import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length, Matches, Validate } from 'class-validator';

import { IdentifierValidator } from 'src/shared/validators/identifier.validator';

export class VerifyChangeIdentifierRequest {
    @ApiProperty({
        description: 'The new login identifier',
        examples: ['+421950353687', 'test@example.com'],
    })
    @IsString()
    @Validate(IdentifierValidator)
    public newIdentifier: string;

    @ApiProperty({
        description: 'The type of the new identifier',
        enum: ['phone', 'email'],
        examples: ['phone', 'email'],
    })
    @IsEnum(['phone', 'email'])
    public type: 'phone' | 'email';

    @ApiProperty({
        description: 'The OTP code sent to the new identifier',
        examples: ['123456'],
    })
    @IsString()
    @Length(6, 6, { message: 'OTP code must be exactly 6 characters' })
    @Matches(/^\d{6}$/, { message: 'OTP code must contain only digits' })
    public code: string;
}
