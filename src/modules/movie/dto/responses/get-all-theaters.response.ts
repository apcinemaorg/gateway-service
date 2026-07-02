import { ApiProperty } from '@nestjs/swagger';

export class GetAllTheatersResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public address: string;
}
