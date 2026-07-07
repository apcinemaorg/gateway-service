import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import {
    createCorsOptions,
    createSwaggerDocumentConfig,
    getRegisteredConfig,
    httpConfig,
    type HttpConfig,
} from '@apcinema/shared';

import { AppModule } from './core/app.module';
import { getValidationPipeConfig } from './core/config/validation-pipe.config';
import { GrpcExceptionFilter } from './shared/filters/grpc-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const http = getRegisteredConfig<HttpConfig>(configService, httpConfig.KEY);
    const logger = new Logger('GatewayService');

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()));
    app.useGlobalFilters(new GrpcExceptionFilter());

    app.enableCors(createCorsOptions(http));

    const swaggerConfig = createSwaggerDocumentConfig(http);
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, swaggerDocument, {
        yamlDocumentUrl: '/openapi.yaml',
        swaggerOptions: {
            persistAuthorization: false,
            requestInterceptor: (request: { credentials?: string }) => {
                request.credentials = 'include';
                return request;
            },
        },
    });

    await app.listen(http.port);

    logger.log(`GatewayService is running on ${http.host}`);
    logger.log(`Swagger is running on ${http.host}/docs`);
}
bootstrap();
