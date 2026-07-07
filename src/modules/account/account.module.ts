import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
    createAuthGrpcClientRegisterOptions,
    getRegisteredConfig,
    authGrpcConfig,
    type AuthGrpcConfig,
} from '@apcinema/shared';

import { AccountController } from './account.controller';
import { AccountGrpcClient } from './account.grpc';

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
    controllers: [AccountController],
    providers: [AccountGrpcClient],
})
export class AccountModule {}
