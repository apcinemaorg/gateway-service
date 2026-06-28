import { HttpStatus } from '@nestjs/common';

import type { HttpErrorBody } from '../dto/error.response';
import { ErrorCode } from '../enums/error-code.enum';

interface ParsedGrpcDetails {
    code?: string;
    message: string | string[];
}

function isHttpErrorBody(value: unknown): value is HttpErrorBody {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    if (
        !('statusCode' in value) ||
        !('code' in value) ||
        !('message' in value)
    ) {
        return false;
    }

    const { statusCode, code, message } = value;

    return (
        typeof statusCode === 'number' &&
        typeof code === 'string' &&
        (typeof message === 'string' || Array.isArray(message))
    );
}

export function createHttpError(
    statusCode: number,
    code: string,
    message: string | string[],
): HttpErrorBody {
    return {
        statusCode,
        error: HttpStatus[statusCode] ?? 'Error',
        code,
        message,
    };
}

export function createInternalError(): HttpErrorBody {
    return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Something went wrong',
    };
}

export function normalizeHttpExceptionBody(
    statusCode: number,
    body: unknown,
    fallbackMessage: string,
): HttpErrorBody {
    if (isHttpErrorBody(body)) {
        return {
            statusCode: body.statusCode,
            error: body.error ?? HttpStatus[statusCode] ?? 'Error',
            code: body.code,
            message: body.message,
        };
    }

    if (typeof body === 'object' && body !== null && 'message' in body) {
        const { message } = body;

        if (typeof message === 'string' || Array.isArray(message)) {
            return createHttpError(statusCode, ErrorCode.HTTP_ERROR, message);
        }
    }

    if (typeof body === 'string') {
        return createHttpError(statusCode, ErrorCode.HTTP_ERROR, body);
    }

    return createHttpError(statusCode, ErrorCode.HTTP_ERROR, fallbackMessage);
}

export function parseGrpcDetails(raw: string): ParsedGrpcDetails {
    try {
        const parsed: unknown = JSON.parse(raw);

        if (typeof parsed !== 'object' || parsed === null || !('message' in parsed)) {
            return { message: raw };
        }

        const { message } = parsed;

        if (typeof message !== 'string' && !Array.isArray(message)) {
            return { message: raw };
        }

        let code: string | undefined;

        if ('code' in parsed && typeof parsed.code === 'string') {
            code = parsed.code;
        }

        return { code, message };
    } catch {
        return { message: raw };
    }
}
