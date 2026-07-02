import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Validate } from 'class-validator';

import { IdentifierValidator } from 'src/shared/validators/identifier.validator';

export class SendChangeIdentifierOtpRequest {
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
}
