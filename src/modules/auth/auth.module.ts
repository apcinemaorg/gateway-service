import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getAuthGrpcClientOptions } from '@apcinema/shared';

import { AuthController } from './auth.controller';
import { AuthGrpcClient } from './auth.grpc';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AUTH_PACKAGE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: getAuthGrpcClientOptions(
                        configService.getOrThrow<string>('AUTH_GRPC_URL'),
                    ),
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthGrpcClient],
})
export class AuthModule {}
