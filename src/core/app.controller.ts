import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { HelloResponse, HealthResponse } from './dto/index'

@Controller()
export class AppController {
	public constructor(private readonly appService: AppService) {}

	@ApiOperation({ summary: 'Welcome message Endpoint', description: 'Returns a welcome message' })
	@ApiOkResponse({ type: HelloResponse })
	@Get()
	public getHello(): Record<string, string> {
		return this.appService.getHello()
	}

	@ApiOperation({ summary: 'Health Endpoint', description: 'Returns the health of the service' })
	@ApiOkResponse({ type: HealthResponse })
	@Get('health')
	public health(): Record<string, string> {
		return this.appService.health()
	}
}
