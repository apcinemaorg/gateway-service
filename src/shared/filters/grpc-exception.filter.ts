import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';
import type { Response } from 'express';

interface GrpcServiceError {
    code: number;
    details?: string;
    message?: string;
}

interface ParsedGrpcDetails {
    code?: string;
    message: string;
}

interface HttpErrorBody {
    statusCode: number;
    error: string;
    code: string;
    message: string | string[];
}

const GRPC_TO_HTTP: Partial<Record<number, { status: number; error: string }>> = {
    [GrpcStatus.INVALID_ARGUMENT]: { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' },
    [GrpcStatus.NOT_FOUND]: { status: HttpStatus.NOT_FOUND, error: 'Not Found' },
    [GrpcStatus.FAILED_PRECONDITION]: { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' },
    [GrpcStatus.UNAUTHENTICATED]: { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized' },
    [GrpcStatus.UNAVAILABLE]: { status: HttpStatus.SERVICE_UNAVAILABLE, error: 'Service Unavailable' },
};

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

        const mapping = GRPC_TO_HTTP[serviceError.code] ?? {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
        };
        const details = this.parseDetails(serviceError.details ?? serviceError.message ?? 'Unknown error');

        return {
            statusCode: mapping.status,
            error: mapping.error,
            code: details.code ?? 'GRPC_ERROR',
            message: details.message,
        };
    }

    private extractGrpcError(exception: unknown): GrpcServiceError | null {
        if (this.isGrpcServiceError(exception)) {
            return exception;
        }

        if (typeof exception === 'object' && exception !== null && 'cause' in exception) {
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
                if (typeof record.message === 'string') {
                    return {
                        code: typeof record.code === 'string' ? record.code : undefined,
                        message: record.message,
                    };
                }
            }
        } catch {
            // plain text details
        }

        return { message: raw };
    }
}
