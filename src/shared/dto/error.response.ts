import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
    @ApiProperty({ example: 400 })
    public statusCode: number;

    @ApiProperty({ example: 'Bad Request' })
    public error: string;

    @ApiProperty({ example: 'OTP_INVALID' })
    public code: string;

    @ApiProperty({
        oneOf: [
            { type: 'string', example: 'Invalid OTP code. Check the code and try again.' },
            { type: 'array', items: { type: 'string' }, example: ['code must be exactly 6 characters'] },
        ],
    })
    public message: string | string[];
}
