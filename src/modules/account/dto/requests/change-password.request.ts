import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordRequest {
    @ApiProperty({
        description: 'Current account password',
        minLength: 8,
        example: 'password123',
    })
    @IsString()
    @MinLength(8)
    public currentPassword: string;

    @ApiProperty({
        description: 'New account password',
        minLength: 8,
        example: 'newpassword123',
    })
    @IsString()
    @MinLength(8)
    public newPassword: string;
}
