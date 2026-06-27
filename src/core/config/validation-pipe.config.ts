import { BadRequestException, type ValidationPipeOptions } from "@nestjs/common";

export function getValidationPipeConfig(): ValidationPipeOptions {
    return {
        transform: true,
        whitelist: true,
        exceptionFactory: (errors) => {
            const message = errors.flatMap((error) =>
                error.constraints ? Object.values(error.constraints) : [],
            );

            return new BadRequestException({
                statusCode: 400,
                error: 'Bad Request',
                code: 'VALIDATION_ERROR',
                message,
            });
        },
    }
}
