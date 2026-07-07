import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    CurrentUser,
    Public,
    REFRESH_TOKEN_COOKIE,
} from '@apcinema/shared';
import type { AuthTokenPayload } from '@apcinema/shared';
import type { Request, Response } from 'express';

import { ErrorResponse } from 'src/shared/dto/error.response';

import { AuthGrpcClient } from './auth.grpc';
import { LoginRequest, MeResponse, RegisterRequest, SendOtpRequest, VerifyOtpRequest } from './dto';
import { AuthActionResponse } from './dto/responses/auth-action.response';
import { clearAuthCookies, setAuthCookies } from './utils/auth-cookies.util';

@Controller('auth')
export class AuthController {
    public constructor(private readonly authGrpcClient: AuthGrpcClient) {}

    @Public()
    @Post('otp/send')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP', description: 'Sends an OTP code to the provided identifier' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid identifier or validation error' })
    @ApiNotFoundResponse({ type: ErrorResponse, description: 'Account not found for the provided identifier' })
    public sendOtp(@Body() dto: SendOtpRequest) {
        return this.authGrpcClient.sendOtp(dto);
    }

    @Public()
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

    @Public()
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

    @Public()
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

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refresh tokens',
        description: 'Issues a new token pair using the refresh token cookie',
    })
    @ApiOkResponse({ type: AuthActionResponse, description: 'Tokens refreshed, auth cookies updated' })
    @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'Invalid or missing refresh token' })
    public async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AuthActionResponse> {
        const cookies = request.cookies as Record<string, string | undefined> | undefined;
        const refreshToken = cookies?.[REFRESH_TOKEN_COOKIE];

        if (!refreshToken) {
            throw new UnauthorizedException('Missing refresh token');
        }

        const result = await this.authGrpcClient.refresh({ refreshToken });
        setAuthCookies(response, result.accessToken, result.refreshToken);
        return { ok: true };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout', description: 'Invalidates refresh token and clears auth cookies' })
    @ApiOkResponse({ type: AuthActionResponse, description: 'Logged out' })
    @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'Unauthorized' })
    public async logout(
        @CurrentUser() user: AuthTokenPayload,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AuthActionResponse> {
        await this.authGrpcClient.logout({ accountId: user.sub });
        clearAuthCookies(response);
        return { ok: true };
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user', description: 'Returns the authenticated user profile' })
    @ApiOkResponse({ type: MeResponse, description: 'Current user profile' })
    @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'Unauthorized' })
    @ApiNotFoundResponse({ type: ErrorResponse, description: 'Account not found' })
    public getMe(@CurrentUser() user: AuthTokenPayload): Promise<MeResponse> {
        return this.authGrpcClient.getMe({ accountId: user.sub });
    }
}
