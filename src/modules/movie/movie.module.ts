import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
    createMovieGrpcClientRegisterOptions,
    getRegisteredConfig,
    movieGrpcConfig,
    type MovieGrpcConfig,
} from '@apcinema/shared';

import { MovieController } from './movie.controller';
import { MovieGrpcClient } from './movie.grpc';
import { ScreeningController } from './screening.controller';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'MOVIE_PACKAGE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    const movieGrpc = getRegisteredConfig<MovieGrpcConfig>(
                        configService,
                        movieGrpcConfig,
                    );

                    return createMovieGrpcClientRegisterOptions(movieGrpc);
                },
            },
        ]),
    ],
    controllers: [MovieController, ScreeningController],
    providers: [MovieGrpcClient],
})
export class MovieModule {}
