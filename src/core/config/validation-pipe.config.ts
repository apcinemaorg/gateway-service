import { BadRequestException, HttpStatus, type ValidationPipeOptions } from '@nestjs/common';

import { ErrorCode } from '../../shared/enums/error-code.enum';
import { createHttpError } from '../../shared/utils/http-error.util';

export function getValidationPipeConfig(): ValidationPipeOptions {
    return {
        transform: true,
        whitelist: true,
        exceptionFactory: (errors) => {
            const message = errors.flatMap((error) =>
                error.constraints ? Object.values(error.constraints) : [],
            );

            return new BadRequestException(
                createHttpError(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, message),
            );
        },
    };
}
