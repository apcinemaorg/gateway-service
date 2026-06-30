import {
    AuthServiceClient,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from '@apcinema/contracts/gen/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
    private authService: AuthServiceClient;

    public constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

    public onModuleInit(): void {
        this.authService = this.client.getService<AuthServiceClient>('AuthService');
    }

    public sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
        return firstValueFrom(this.authService.sendOtp(request));
    }

    public verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
        return firstValueFrom(this.authService.verifyOtp(request));
    }

    public register(request: RegisterRequest): Promise<RegisterResponse> {
        return firstValueFrom(this.authService.register(request));
    }

    public login(request: LoginRequest): Promise<LoginResponse> {
        return firstValueFrom(this.authService.login(request));
    }
}