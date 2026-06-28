import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	public getHello(): Record<string, string> {
		return { message: 'Welcome to the Gateway Service' }
	}
	public health(): Record<string, string> {
		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
		}
	}
}
