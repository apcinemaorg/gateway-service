import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
    createUserGrpcClientRegisterOptions,
    getRegisteredConfig,
    userGrpcConfig,
    type UserGrpcConfig,
} from '@apcinema/shared';

import { AdminUsersController } from './admin-users.controller';
import { UserController } from './user.controller';
import { UserGrpcClient } from './user.grpc';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'USER_PACKAGE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    const userGrpc = getRegisteredConfig<UserGrpcConfig>(
                        configService,
                        userGrpcConfig,
                    );

                    return createUserGrpcClientRegisterOptions(userGrpc);
                },
            },
        ]),
    ],
    controllers: [UserController, AdminUsersController],
    providers: [UserGrpcClient],
})
export class UserModule {}
