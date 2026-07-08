import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeResponse {
    @ApiProperty({ example: 'clx123abc' })
    public id: string;

    @ApiPropertyOptional({ example: '+380501234567' })
    public phone?: string;

    @ApiPropertyOptional({ example: 'user@example.com' })
    public email?: string;

    @ApiProperty({ example: 'user', enum: ['user', 'moderator', 'admin'] })
    public role: string;

    @ApiProperty({ example: true })
    public isPhoneVerified: boolean;

    @ApiProperty({ example: false })
    public isEmailVerified: boolean;
}
