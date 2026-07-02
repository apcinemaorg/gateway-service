import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getAuthGrpcClientOptions } from '@apcinema/shared';

import { AccountController } from './account.controller';
import { AccountGrpcClient } from './account.grpc';

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
    controllers: [AccountController],
    providers: [AccountGrpcClient],
})
export class AccountModule {}
