import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GetAllMoviesResponseDto } from './get-all-movies.response';

export class GetMovieBySlugResponseDto extends GetAllMoviesResponseDto {
    @ApiPropertyOptional()
    public description?: string;
}
