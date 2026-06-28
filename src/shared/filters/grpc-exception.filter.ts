import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { Response } from 'express';

import { grpcToHttp, parseRpcErrorPayload } from '@apcinema/shared';

import type { HttpErrorBody } from '../dto/error.response';
import { ErrorCode } from '../enums/error-code.enum';
import {
    createHttpError,
    createInternalError,
    normalizeHttpExceptionBody,
} from '../utils/http-error.util';

interface GrpcServiceError {
    code: number;
    details?: string;
    message?: string;
}

function hasCause(value: unknown): value is { cause: unknown } {
    return typeof value === 'object' && value !== null && 'cause' in value;
}

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GrpcExceptionFilter.name);

    public catch(exception: unknown, host: ArgumentsHost): void {
        if (host.getType() !== 'http') {
            return;
        }

        const response = host.switchToHttp().getResponse<Response>();
        const grpcError = this.toHttpErrorFromGrpc(exception);

        if (grpcError) {
            response.status(grpcError.statusCode).json(grpcError);
            return;
        }

        if (exception instanceof HttpException) {
            const statusCode = exception.getStatus();
            const body = normalizeHttpExceptionBody(
                statusCode,
                exception.getResponse(),
                exception.message,
            );

            response.status(statusCode).json(body);
            return;
        }

        this.logger.error(exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createInternalError());
    }

    private toHttpErrorFromGrpc(exception: unknown): HttpErrorBody | null {
        const serviceError = this.extractGrpcError(exception);
        if (!serviceError) {
            return null;
        }

        const statusCode = grpcToHttp[serviceError.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const details = parseRpcErrorPayload(
            serviceError.details ?? serviceError.message ?? 'Unknown error',
        );

        return createHttpError(
            statusCode,
            details.code ?? ErrorCode.GRPC_ERROR,
            details.message,
        );
    }

    private extractGrpcError(exception: unknown): GrpcServiceError | null {
        if (this.isGrpcServiceError(exception)) {
            return exception;
        }

        if (hasCause(exception) && this.isGrpcServiceError(exception.cause)) {
            return exception.cause;
        }

        return null;
    }

    private isGrpcServiceError(error: unknown): error is GrpcServiceError {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            typeof error.code === 'number'
        );
    }
}
