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
    provideRolesGuard,
    RolesGuard,
    type JwtConfig,
} from '@apcinema/shared';
import { AccountModule } from 'src/modules/account/account.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';

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
                    jwtConfig,
                );

                return createJwtModuleOptions(jwt);
            },
        }),
        AuthModule,
        AccountModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        provideJwtAuthGuard(JwtService, Reflector),
        provideRolesGuard(Reflector),
    ],
})
export class AppModule {}
