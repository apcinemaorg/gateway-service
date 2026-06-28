import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { SendOtpRequest, VerifyOtpRequest, LoginRequest, RegisterRequest } from './dto';
import { AuthGrpcClient } from './auth.grpc';
import { ErrorResponse } from 'src/shared/dto/error.response';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authGrpcClient: AuthGrpcClient) {}
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP', description: 'Sends an OTP code to the provided identifier' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid identifier or validation error' })
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

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register', description: 'Registers a new account after identifier verification' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid request or validation error' })
  public async register(@Body() dto: RegisterRequest){
    return this.authGrpcClient.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login', description: 'Authenticates user with identifier and password' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid credentials or validation error' })
  public async login(@Body() dto: LoginRequest){
    return this.authGrpcClient.login(dto)
  }
}
