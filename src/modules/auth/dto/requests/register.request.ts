import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { OtpIdentifierRequest } from './otp-identifier.request';

export class RegisterRequest extends OtpIdentifierRequest {
    @ApiProperty({
        description: 'Account password',
        minLength: 8,
        example: 'password123',
    })
    @IsString()
    @MinLength(8)
    public password: string;

    @ApiPropertyOptional({ example: 'johndoe' })
    @IsOptional()
    @IsString()
    public username?: string;

    @ApiPropertyOptional({ example: 'John' })
    @IsOptional()
    @IsString()
    public firstName?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsOptional()
    @IsString()
    public lastName?: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    public displayName?: string;
}
