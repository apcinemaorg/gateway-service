import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
    createAuthGrpcClientRegisterOptions,
    getRegisteredConfig,
    authGrpcConfig,
    type AuthGrpcConfig,
} from '@apcinema/shared';

import { AuthController } from './auth.controller';
import { AuthGrpcClient } from './auth.grpc';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AUTH_PACKAGE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    const authGrpc = getRegisteredConfig<AuthGrpcConfig>(
                        configService,
                        authGrpcConfig.KEY,
                    );

                    return createAuthGrpcClientRegisterOptions(authGrpc);
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthGrpcClient],
})
export class AuthModule {}
