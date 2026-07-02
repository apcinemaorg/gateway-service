import { Controller, Get, Param, Query } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Public } from '@apcinema/shared';

import {
    CategoryResponseDto,
    GetAllMoviesQuery,
    GetAllMoviesResponseDto,
    GetAllTheatersResponseDto,
    GetMovieBySlugResponseDto,
} from './dto';
import { MovieGrpcClient } from './movie.grpc';

@ApiTags('Movies')
@Controller()
export class MovieController {
    public constructor(private readonly movieGrpcClient: MovieGrpcClient) {}

    @Public()
    @Get('movies')
    @ApiOperation({ summary: 'Get all movies' })
    @ApiOkResponse({ type: GetAllMoviesResponseDto, isArray: true })
    public getAll(@Query() query: GetAllMoviesQuery): Promise<GetAllMoviesResponseDto[]> {
        return this.movieGrpcClient.getAll(query);
    }

    @Public()
    @Get('movies/popular')
    @ApiOperation({ summary: 'Get popular movies' })
    @ApiOkResponse({ type: GetAllMoviesResponseDto, isArray: true })
    public getPopular(): Promise<GetAllMoviesResponseDto[]> {
        return this.movieGrpcClient.getPopular();
    }

    @Public()
    @Get('movies/:slug')
    @ApiOperation({ summary: 'Get movie by slug' })
    @ApiOkResponse({ type: GetMovieBySlugResponseDto })
    public getBySlug(@Param('slug') slug: string): Promise<GetMovieBySlugResponseDto> {
        return this.movieGrpcClient.getBySlug({ slug });
    }

    @Public()
    @Get('categories')
    @ApiOperation({ summary: 'Get movie categories' })
    @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
    public getCategories(): Promise<CategoryResponseDto[]> {
        return this.movieGrpcClient.getCategories();
    }

    @Public()
    @Get('theaters')
    @ApiOperation({ summary: 'Get all theaters' })
    @ApiOkResponse({ type: GetAllTheatersResponseDto, isArray: true })
    public getAllTheaters(): Promise<GetAllTheatersResponseDto[]> {
        return this.movieGrpcClient.getAllTheaters();
    }
}
