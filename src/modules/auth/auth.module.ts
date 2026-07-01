import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES_IN, getAuthGrpcClientOptions } from '@apcinema/shared';

import { AuthController } from './auth.controller';
import { AuthGrpcClient } from './auth.grpc';

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
            }),
        }),
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
