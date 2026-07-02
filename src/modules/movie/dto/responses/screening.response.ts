import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetScreeningsByDateQuery {
    @ApiPropertyOptional({ description: 'Theater ID to filter screenings' })
    @IsOptional()
    @IsString()
    public theaterId?: string;

    @ApiPropertyOptional({ description: 'Target date (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    public date?: string;
}

export class ScreeningTheaterResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public address: string;
}

export class ScreeningHallResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public name: string;
}

export class ScreeningMovieResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public title: string;

    @ApiProperty()
    public slug: string;

    @ApiProperty()
    public banner: string;
}

export class ScreeningSeatTypeResponseDto {
    @ApiProperty()
    public type: string;

    @ApiProperty()
    public price: number;
}

export class ScreeningItemResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public startAt: string;

    @ApiProperty()
    public endAt: string;

    @ApiProperty()
    public hallId: string;

    @ApiProperty({ type: ScreeningTheaterResponseDto })
    public theater: ScreeningTheaterResponseDto;

    @ApiProperty({ type: ScreeningHallResponseDto })
    public hall: ScreeningHallResponseDto;

    @ApiProperty({ type: ScreeningMovieResponseDto })
    public movie: ScreeningMovieResponseDto;

    @ApiProperty({ type: ScreeningSeatTypeResponseDto, isArray: true })
    public seatTypes: ScreeningSeatTypeResponseDto[];
}

export class GetScreeningByIdResponseDto {
    @ApiProperty({ type: ScreeningItemResponseDto })
    public screening: ScreeningItemResponseDto;
}
