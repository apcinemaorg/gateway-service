import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from '@apcinema/shared';

import { AppService } from './app.service';
import { HealthResponse, HelloResponse } from './dto/index';

@Controller()
export class AppController {
    public constructor(private readonly appService: AppService) {}

    @Public()
    @ApiOperation({ summary: 'Welcome message Endpoint', description: 'Returns a welcome message' })
    @ApiOkResponse({ type: HelloResponse })
    @Get()
    public getHello(): Record<string, string> {
        return this.appService.getHello();
    }

    @Public()
    @ApiOperation({ summary: 'Health Endpoint', description: 'Returns the health of the service' })
    @ApiOkResponse({ type: HealthResponse })
    @Get('health')
    public health(): Record<string, string> {
        return this.appService.health();
    }
}
