import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthActionResponse {
    @ApiProperty({ description: 'Whether the operation succeeded', example: true })
    public ok: boolean;

    @ApiPropertyOptional({
        description: 'Error message when ok is false',
        example: 'Invalid credentials',
    })
    public errorMessage?: string;
}
