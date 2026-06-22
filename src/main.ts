import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './core/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const logger = new Logger('GatewayService')

	app.enableCors({
		origin: config.getOrThrow<string>('HTTP_CORS').split(','),
		credentials: true
	})

	const swaggerConfig = new DocumentBuilder()
		.setTitle('APCinema Gateway Service')
		.setDescription('Gateway Service API')
		.setVersion('1.0.0')
		.addBearerAuth()
		.build()
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
