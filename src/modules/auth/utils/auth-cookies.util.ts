import {
    ACCESS_TOKEN_COOKIE,
    accessTokenCookieOptions,
    authCookieClearOptions,
    REFRESH_TOKEN_COOKIE,
    refreshTokenCookieOptions,
} from '@apcinema/shared';
import type { Response } from 'express';

export function setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
): void {
    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions);
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions);
}

export function clearAuthCookies(response: Response): void {
    response.clearCookie(ACCESS_TOKEN_COOKIE, authCookieClearOptions);
    response.clearCookie(REFRESH_TOKEN_COOKIE, authCookieClearOptions);
}
