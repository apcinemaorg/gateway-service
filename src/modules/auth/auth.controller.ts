import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { SendOtpRequest, VerifyOtpRequest } from './dto';
import { AuthGrpcClient } from './auth.grpc';
import { ErrorResponse } from 'src/shared/dto/error.response';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authGrpcClient: AuthGrpcClient) {}
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  public async sendOtp(@Body() dto: SendOtpRequest){
    return this.authGrpcClient.sendOtp(dto)
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP', description: 'Verifies the OTP code and returns auth tokens' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid OTP code or validation error' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'OTP expired or account not found' })
  public async verifyOtp(@Body() dto: VerifyOtpRequest){
    return this.authGrpcClient.verifyOtp(dto)
  }
}
