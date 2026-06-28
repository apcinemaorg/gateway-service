import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length, Matches } from 'class-validator';

import { OtpIdentifierRequest } from './otp-identifier.request';

export class SendOtpRequest extends OtpIdentifierRequest {}

export class VerifyOtpRequest extends OtpIdentifierRequest {
    @ApiProperty({
        description: 'The OTP code',
        examples: ['123456'],
    })
    @IsString()
    @Length(6, 6, { message: 'OTP code must be exactly 6 characters' })
    @Matches(/^\d{6}$/, { message: 'OTP code must contain only digits' })
    public code: string;
}
