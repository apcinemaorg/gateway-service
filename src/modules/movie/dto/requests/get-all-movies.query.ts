import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetAllMoviesQuery {
    @ApiPropertyOptional({ description: 'Filter movies by category' })
    @IsOptional()
    @IsString()
    public category?: string;

    @ApiPropertyOptional({ description: 'Return movies in random order' })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    public random?: boolean;

    @ApiPropertyOptional({ description: 'Limit number of movies' })
    @IsOptional()
    @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
    @IsInt()
    @Min(1)
    public limit?: number;
}
