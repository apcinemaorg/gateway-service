import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, OpenAPIObject } from "@nestjs/swagger";

export function getSwaggerConfig(configService: ConfigService): Omit<OpenAPIObject, "paths"> {
    return new DocumentBuilder()
        .setTitle(configService.getOrThrow<string>('SWAGGER_TITLE'))
        .setDescription(configService.getOrThrow<string>('SWAGGER_DESCRIPTION'))
        .setVersion(configService.getOrThrow<string>('SWAGGER_VERSION'))
        .addBearerAuth()
        .build()
}