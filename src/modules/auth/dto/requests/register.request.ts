import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { OtpIdentifierRequest } from './otp-identifier.request';

export class RegisterRequest extends OtpIdentifierRequest {
    @ApiProperty({
        description: 'The user password',
        examples: ['SecurePass123'],
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    public password: string;

    @ApiPropertyOptional({
        description: 'The username',
        examples: ['johndoe'],
    })
    @IsOptional()
    @IsString()
    public username?: string;

    @ApiPropertyOptional({
        description: 'The first name',
        examples: ['John'],
    })
    @IsOptional()
    @IsString()
    public firstName?: string;

    @ApiPropertyOptional({
        description: 'The last name',
        examples: ['Doe'],
    })
    @IsOptional()
    @IsString()
    public lastName?: string;
}
