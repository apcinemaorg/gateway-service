import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES_IN, provideJwtAuthGuard } from '@apcinema/shared';
import { AccountModule } from 'src/modules/account/account.module';
import { AuthModule } from 'src/modules/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
            }),
        }),
        AuthModule,
        AccountModule,
    ],
    controllers: [AppController],
    providers: [AppService, provideJwtAuthGuard(JwtService, Reflector)],
})
export class AppModule {}
