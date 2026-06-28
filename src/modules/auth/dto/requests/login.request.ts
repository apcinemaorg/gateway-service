import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { OtpIdentifierRequest } from './otp-identifier.request';

export class LoginRequest extends OtpIdentifierRequest {
    @ApiProperty({
        description: 'The user password',
        examples: ['SecurePass123'],
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    public password: string;
}
