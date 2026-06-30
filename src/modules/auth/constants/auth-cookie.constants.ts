import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
};

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const accessTokenCookieOptions: CookieOptions = {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
};

export const refreshTokenCookieOptions: CookieOptions = {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
};

export const authCookieClearOptions: CookieOptions = {
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
};
