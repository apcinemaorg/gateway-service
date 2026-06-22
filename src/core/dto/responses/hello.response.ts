import { ApiProperty } from "@nestjs/swagger";

export class HelloResponse {
    @ApiProperty({ description: 'The welcome message', example: 'Welcome to the Gateway Service' })
    public message: string
}