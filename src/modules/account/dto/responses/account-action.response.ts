import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountActionResponse {
    @ApiProperty({ description: 'Whether the operation succeeded', example: true })
    public ok: boolean;

    @ApiPropertyOptional({
        description: 'Error message when ok is false',
        example: 'Invalid current password',
    })
    public errorMessage?: string;
}
