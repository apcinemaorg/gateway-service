import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ACCESS_TOKEN_EXPIRES_IN, JwtAuthGuard } from '@apcinema/shared';
import cookieParser from 'cookie-parser';
import request from 'supertest';

import { AppController } from '../src/core/app.controller';
import { AppService } from '../src/core/app.service';
import { getValidationPipeConfig } from '../src/core/config/validation-pipe.config';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthGrpcClient } from '../src/modules/auth/auth.grpc';
import { GrpcExceptionFilter } from '../src/shared/filters/grpc-exception.filter';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const authGrpcClientMock = {
        sendOtp: jest.fn(),
        verifyOtp: jest.fn(),
        register: jest.fn(),
        login: jest.fn(),
        refresh: jest.fn(),
        logout: jest.fn(),
        getMe: jest.fn(),
        onModuleInit: jest.fn(),
    };

    beforeAll(() => {
        process.env.JWT_SECRET = 'test-jwt-secret-for-e2e-tests';
    });

    beforeEach(async () => {
        jwtService = new JwtService({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
        });

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true })],
            controllers: [AuthController, AppController],
            providers: [
                AppService,
                {
                    provide: JwtService,
                    useValue: jwtService,
                },
                {
                    provide: APP_GUARD,
                    useFactory: (jwt: JwtService, reflector: Reflector) =>
                        new JwtAuthGuard(jwt, reflector),
                    inject: [JwtService, Reflector],
                },
                {
                    provide: AuthGrpcClient,
                    useValue: authGrpcClientMock,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.use(cookieParser());
        app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()));
        app.useGlobalFilters(new GrpcExceptionFilter());

        await app.init();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        if (app) {
            await app.close();
        }
    });

    it('/auth/me (GET) returns 401 without access token', () => {
        return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('/auth/me (GET) returns profile when access token cookie is valid', async () => {
        const accountId = 'account-123';
        const accessToken = await jwtService.signAsync(
            { sub: accountId, type: 'access' },
            { expiresIn: '15m' },
        );

        authGrpcClientMock.getMe.mockResolvedValue({
            id: accountId,
            phone: '+380501234567',
            email: undefined,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            isPhoneVerified: true,
            isEmailVerified: false,
        });

        const response = await request(app.getHttpServer())
            .get('/auth/me')
            .set('Cookie', [`access_token=${accessToken}`])
            .expect(200);

        expect(response.body).toMatchObject({
            id: accountId,
            phone: '+380501234567',
            username: 'testuser',
        });
        expect(authGrpcClientMock.getMe).toHaveBeenCalledWith({ accountId });
    });

    it('/auth/logout (POST) clears cookies and calls auth service', async () => {
        const accountId = 'account-456';
        const accessToken = await jwtService.signAsync(
            { sub: accountId, type: 'access' },
            { expiresIn: '15m' },
        );

        authGrpcClientMock.logout.mockResolvedValue({ ok: true });

        const response = await request(app.getHttpServer())
            .post('/auth/logout')
            .set('Cookie', [`access_token=${accessToken}`])
            .expect(200);

        expect(response.body).toEqual({ ok: true });
        expect(authGrpcClientMock.logout).toHaveBeenCalledWith({ accountId });

        const setCookieHeader = response.headers['set-cookie'];
        expect(setCookieHeader).toBeDefined();
        expect(JSON.stringify(setCookieHeader)).toContain('access_token=;');
    });

    it('/auth/refresh (POST) returns 401 without refresh token cookie', () => {
        return request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });

    it('/auth/refresh (POST) updates cookies when refresh token is valid', async () => {
        authGrpcClientMock.refresh.mockResolvedValue({
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
        });

        const response = await request(app.getHttpServer())
            .post('/auth/refresh')
            .set('Cookie', ['refresh_token=valid-refresh-token'])
            .expect(200);

        expect(response.body).toEqual({ ok: true });
        expect(authGrpcClientMock.refresh).toHaveBeenCalledWith({
            refreshToken: 'valid-refresh-token',
        });

        const setCookieHeader = response.headers['set-cookie'];
        expect(JSON.stringify(setCookieHeader)).toContain('new-access-token');
        expect(JSON.stringify(setCookieHeader)).toContain('new-refresh-token');
    });
});
