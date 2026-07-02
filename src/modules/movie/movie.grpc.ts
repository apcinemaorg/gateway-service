import type {
    GetAllMoviesRequest,
    GetAllMoviesResponse,
    GetAllTheatersResponse,
    GetCategoriesResponse,
    GetMovieBySlugRequest,
    GetScreeningByIdRequest,
    GetScreeningDetailResponse,
    GetScreeningsByDateRequest,
    GetScreeningsByMovieRequest,
    GetScreeningsListResponse,
    MovieListItem,
    MovieResponse,
    MovieServiceClient,
    ScreeningItem,
    TheaterItem,
} from '@apcinema/contracts/gen/movie';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MovieGrpcClient implements OnModuleInit {
    private movieService: MovieServiceClient;

    public constructor(@Inject('MOVIE_PACKAGE') private readonly client: ClientGrpc) {}

    public onModuleInit(): void {
        this.movieService = this.client.getService<MovieServiceClient>('MovieService');
    }

    public getAll(request: GetAllMoviesRequest): Promise<MovieListItem[]> {
        return firstValueFrom(this.movieService.getAll(request)).then(
            response => response.movies,
        );
    }

    public getPopular(): Promise<MovieListItem[]> {
        return firstValueFrom(this.movieService.getPopular({})).then(
            response => response.movies,
        );
    }

    public getBySlug(request: GetMovieBySlugRequest): Promise<MovieResponse> {
        return firstValueFrom(this.movieService.getBySlug(request));
    }

    public getCategories(): Promise<GetCategoriesResponse['categories']> {
        return firstValueFrom(this.movieService.getCategories({})).then(
            response => response.categories,
        );
    }

    public getAllTheaters(): Promise<TheaterItem[]> {
        return firstValueFrom(this.movieService.getAllTheaters({})).then(
            response => response.theaters,
        );
    }

    public getScreeningsByDate(
        request: GetScreeningsByDateRequest,
    ): Promise<ScreeningItem[]> {
        return firstValueFrom(this.movieService.getScreeningsByDate(request)).then(
            response => response.screenings,
        );
    }

    public getScreeningsByMovie(
        request: GetScreeningsByMovieRequest,
    ): Promise<ScreeningItem[]> {
        return firstValueFrom(this.movieService.getScreeningsByMovie(request)).then(
            response => response.screenings,
        );
    }

    public getScreeningById(
        request: GetScreeningByIdRequest,
    ): Promise<GetScreeningDetailResponse> {
        return firstValueFrom(this.movieService.getScreeningById(request));
    }
}
