import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
    createAppConfigOptions,
    createJwtModuleOptions,
    gatewayConfigs,
    getRegisteredConfig,
    jwtConfig,
    provideJwtAuthGuard,
    type JwtConfig,
} from '@apcinema/shared';
import { AccountModule } from 'src/modules/account/account.module';
import { AuthModule } from 'src/modules/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot(createAppConfigOptions(gatewayConfigs)),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const jwt = getRegisteredConfig<JwtConfig>(
                    configService,
                    jwtConfig.KEY,
                );

                return createJwtModuleOptions(jwt);
            },
        }),
        AuthModule,
        AccountModule,
    ],
    controllers: [AppController],
    providers: [AppService, provideJwtAuthGuard(JwtService, Reflector)],
})
export class AppModule {}
