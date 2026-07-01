import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeResponse {
    @ApiProperty({ example: 'clx123abc' })
    public id: string;

    @ApiPropertyOptional({ example: '+380501234567' })
    public phone?: string;

    @ApiPropertyOptional({ example: 'user@example.com' })
    public email?: string;

    @ApiPropertyOptional({ example: 'johndoe' })
    public username?: string;

    @ApiPropertyOptional({ example: 'John' })
    public firstName?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    public lastName?: string;

    @ApiProperty({ example: true })
    public isPhoneVerified: boolean;

    @ApiProperty({ example: false })
    public isEmailVerified: boolean;
}
