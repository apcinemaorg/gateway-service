import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './core/app.module'
import { SwaggerModule } from '@nestjs/swagger'
import { getCorsConfig } from './core/config/cors.config'
import { getSwaggerConfig } from './core/config/swagger.config'
import { getValidationPipeConfig } from './core/config/validation-pipe.config'
import { GrpcExceptionFilter } from './shared/filters/grpc-exception.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const logger = new Logger('GatewayService')


	app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()))
	app.useGlobalFilters(new GrpcExceptionFilter())

	app.enableCors(getCorsConfig(config))

	const swaggerConfig = getSwaggerConfig(config)
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('docs', app, swaggerDocument,{
		yamlDocumentUrl: '/openapi.yaml'
	})


	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')
	
	
	await app.listen(port)


	logger.log(`GatewayService is running on ${host}`)
	logger.log(`Swagger is running on ${host}/docs`)
}
bootstrap()
