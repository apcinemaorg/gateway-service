import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { OtpIdentifierRequest } from './otp-identifier.request';

export class LoginRequest extends OtpIdentifierRequest {
    @ApiProperty({
        description: 'Account password',
        minLength: 8,
        example: 'password123',
    })
    @IsString()
    @MinLength(8)
    public password: string;
}
