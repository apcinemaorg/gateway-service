import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@apcinema/shared';
import type { AuthTokenPayload } from '@apcinema/shared';
import type { Response } from 'express';

import { ErrorResponse } from 'src/shared/dto/error.response';
import { setAuthCookies } from '../auth/utils/auth-cookies.util';

import { AccountGrpcClient } from './account.grpc';
import {
    AccountActionResponse,
    ChangePasswordRequest,
    SendChangeIdentifierOtpRequest,
    VerifyChangeIdentifierRequest,
} from './dto';

@Controller('account')
export class AccountController {
    public constructor(private readonly accountGrpcClient: AccountGrpcClient) {}

    @Post('password')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Change password',
        description: 'Changes the account password and rotates auth cookies on success',
    })
    @ApiOkResponse({ type: AccountActionResponse, description: 'Password change result' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Validation error' })
    @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'Unauthorized' })
    public async changePassword(
        @CurrentUser() user: AuthTokenPayload,
        @Body() dto: ChangePasswordRequest,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccountActionResponse> {
        const result = await this.accountGrpcClient.changePassword({
            accountId: user.sub,
            currentPassword: dto.currentPassword,
            newPassword: dto.newPassword,
        });

        if (!result.ok) {
            return { ok: false, errorMessage: result.errorMessage };
        }

        setAuthCookies(response, result.accessToken, result.refreshToken);
        return { ok: true };
    }

    @Post('identifier/otp/send')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Send OTP for identifier change',
        description: 'Sends an OTP code to the new phone or email identifier',
    })
    @ApiOkResponse({ type: AccountActionResponse, description: 'OTP send result' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Validation error' })
    @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'Unauthorized' })
    public async sendChangeIdentifierOtp(
        @CurrentUser() user: AuthTokenPayload,
        @Body() dto: SendChangeIdentifierOtpRequest,
    ): Promise<AccountActionResponse> {
        const result = await this.accountGrpcClient.sendChangeIdentifierOtp({
            accountId: user.sub,
            newIdentifier: dto.newIdentifier,
            type: dto.type,
        });

        if (!result.ok) {
            return { ok: false, errorMessage: result.errorMessage };
        }

        return { ok: true };
    }

    @Post('identifier/otp/verify')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Verify OTP and change identifier',
        description: 'Verifies the OTP code and updates the login identifier',
    })
    @ApiOkResponse({ type: AccountActionResponse, description: 'Identifier change result' })
    @ApiBadRequestResponse({ type: ErrorResponse, description: 'Validation error or invalid OTP' })
    @ApiNotFoundResponse({ type: ErrorResponse, description: 'Pending change expired' })
    @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'Unauthorized' })
    public async verifyChangeIdentifier(
        @CurrentUser() user: AuthTokenPayload,
        @Body() dto: VerifyChangeIdentifierRequest,
    ): Promise<AccountActionResponse> {
        const result = await this.accountGrpcClient.verifyChangeIdentifier({
            accountId: user.sub,
            newIdentifier: dto.newIdentifier,
            type: dto.type,
            code: dto.code,
        });

        if (!result.ok) {
            return { ok: false, errorMessage: result.errorMessage };
        }

        return { ok: true };
    }
}
