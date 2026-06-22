import { ApiProperty } from "@nestjs/swagger";

export class HealthResponse {
    @ApiProperty({ description: 'The status of the service', example: 'ok' })
    public status: string
    @ApiProperty({ description: 'The timestamp of the service', example: '2021-01-01T00:00:00.000Z' })
    public timestamp: string
}