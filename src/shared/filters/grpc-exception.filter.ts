import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { Response } from 'express';

import { grpcToHttp } from '../utils/grpc-to-http';

interface GrpcServiceError {
    code: number;
    details?: string;
    message?: string;
}

interface ParsedGrpcDetails {
    code?: string;
    message: string | string[];
}

interface HttpErrorBody {
    statusCode: number;
    error: string;
    code: string;
    message: string | string[];
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
            const body = exception.getResponse();

            if (typeof body === 'object' && body !== null) {
                response.status(statusCode).json(body);
                return;
            }

            response.status(statusCode).json({
                statusCode,
                error: HttpStatus[statusCode] ?? 'Error',
                code: 'HTTP_ERROR',
                message: typeof body === 'string' ? body : exception.message,
            });
            return;
        }

        this.logger.error(exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
            code: 'INTERNAL_ERROR',
            message: 'Something went wrong',
        });
    }

    private toHttpErrorFromGrpc(exception: unknown): HttpErrorBody | null {
        const serviceError = this.extractGrpcError(exception);
        if (!serviceError) {
            return null;
        }

        const statusCode = grpcToHttp[serviceError.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const error = HttpStatus[statusCode] ?? 'Error';
        const details = this.parseDetails(serviceError.details ?? serviceError.message ?? 'Unknown error');

        return {
            statusCode,
            error,
            code: details.code ?? 'GRPC_ERROR',
            message: details.message,
        };
    }

    private extractGrpcError(exception: unknown): GrpcServiceError | null {
        if (this.isGrpcServiceError(exception)) {
            return exception;
        }

        if (
            typeof exception === 'object' &&
            exception !== null &&
            'cause' in exception
        ) {
            const cause = (exception as { cause?: unknown }).cause;
            if (this.isGrpcServiceError(cause)) {
                return cause;
            }
        }

        return null;
    }

    private isGrpcServiceError(error: unknown): error is GrpcServiceError {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            typeof (error as GrpcServiceError).code === 'number'
        );
    }

    private parseDetails(raw: string): ParsedGrpcDetails {
        try {
            const parsed: unknown = JSON.parse(raw);
            if (typeof parsed === 'object' && parsed !== null && 'message' in parsed) {
                const record = parsed as Record<string, unknown>;
                if (typeof record.message === 'string' || Array.isArray(record.message)) {
                    return {
                        code: typeof record.code === 'string' ? record.code : undefined,
                        message: record.message,
                    };
                }
            }
        } catch {
            return { code: undefined, message: raw };
        }

        return { message: raw };
    }
}
