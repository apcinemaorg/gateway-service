import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllMoviesResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public title: string;

    @ApiProperty()
    public slug: string;

    @ApiProperty()
    public poster: string;

    @ApiProperty()
    public banner: string;

    @ApiPropertyOptional()
    public ratingAge?: string;

    @ApiPropertyOptional({ nullable: true })
    public trailer?: string;

    @ApiProperty()
    public releaseDate: string;
}
