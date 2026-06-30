import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { ErrorResponse } from 'src/shared/dto/error.response';

import { AuthGrpcClient } from './auth.grpc';
import { LoginRequest, RegisterRequest, SendOtpRequest, VerifyOtpRequest } from './dto';
import { AuthActionResponse } from './dto/responses/auth-action.response';
import { setAuthCookies } from './utils/auth-cookies.util';

@Controller('auth')
export class AuthController {
    public constructor(private readonly authGrpcClient: AuthGrpcClient) {}

    @Post('otp/send')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP', description: 'Sends an OTP code to the provided identifier' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid identifier or validation error' })
    public sendOtp(@Body() dto: SendOtpRequest) {
        return this.authGrpcClient.sendOtp(dto);
    }

    @Post('otp/verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verify OTP',
        description: 'Verifies the OTP code and sets auth cookies',
    })
    @ApiOkResponse({ type: AuthActionResponse, description: 'OTP verified, auth cookies set' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid OTP code or validation error' })
    @ApiNotFoundResponse({ type: ErrorResponse, description: 'OTP expired or account not found' })
    public async verifyOtp(
        @Body() dto: VerifyOtpRequest,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AuthActionResponse> {
        const result = await this.authGrpcClient.verifyOtp(dto);
        setAuthCookies(response, result.accessToken, result.refreshToken);
        return { ok: true };
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Register',
        description: 'Registers a new account and sets auth cookies on success',
    })
    @ApiOkResponse({ type: AuthActionResponse, description: 'Registration result' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid request or validation error' })
    public async register(
        @Body() dto: RegisterRequest,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AuthActionResponse> {
        const result = await this.authGrpcClient.register(dto);

        if (!result.ok) {
            return { ok: false, errorMessage: result.errorMessage };
        }

        setAuthCookies(response, result.accessToken, result.refreshToken);
        return { ok: true };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Login',
        description: 'Authenticates user with identifier and password, sets auth cookies on success',
    })
    @ApiOkResponse({ type: AuthActionResponse, description: 'Login result' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid credentials or validation error' })
    public async login(
        @Body() dto: LoginRequest,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AuthActionResponse> {
        const result = await this.authGrpcClient.login(dto);

        if (!result.ok) {
            return { ok: false, errorMessage: result.errorMessage };
        }

        setAuthCookies(response, result.accessToken, result.refreshToken);
        return { ok: true };
    }
}
