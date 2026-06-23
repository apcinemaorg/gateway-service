import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendOtpRequest } from './dto';
import { AuthGrpcClient } from './auth.grpc';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authGrpcClient: AuthGrpcClient) {}
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  public async sendOtp(@Body() dto: SendOtpRequest){
    return this.authGrpcClient.sendOtp(dto)
  }
}
