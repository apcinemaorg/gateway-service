import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@apcinema/shared';

import {
    GetScreeningByIdResponseDto,
    GetScreeningsByDateQuery,
    ScreeningItemResponseDto,
} from './dto/responses/screening.response';
import { MovieGrpcClient } from './movie.grpc';

@ApiTags('Screenings')
@Controller('screenings')
export class ScreeningController {
    public constructor(private readonly movieGrpcClient: MovieGrpcClient) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get screenings by date' })
    @ApiOkResponse({ type: ScreeningItemResponseDto, isArray: true })
    public getByDate(@Query() query: GetScreeningsByDateQuery) {
        return this.movieGrpcClient.getScreeningsByDate(query);
    }

    @Public()
    @Get('movie/:movieId')
    @ApiOperation({ summary: 'Get screenings by movie' })
    @ApiOkResponse({ type: ScreeningItemResponseDto, isArray: true })
    public getByMovie(@Param('movieId') movieId: string) {
        return this.movieGrpcClient.getScreeningsByMovie({ movieId });
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get screening by id' })
    @ApiOkResponse({ type: GetScreeningByIdResponseDto })
    public getById(@Param('id') id: string) {
        return this.movieGrpcClient.getScreeningById({ id });
    }
}
