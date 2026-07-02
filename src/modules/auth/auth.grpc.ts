import {
    AuthServiceClient,
    GetMeRequest,
    GetMeResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
    RefreshRequest,
    RefreshResponse,
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

    public refresh(request: RefreshRequest): Promise<RefreshResponse> {
        return firstValueFrom(this.authService.refresh(request));
    }

    public logout(request: LogoutRequest): Promise<LogoutResponse> {
        return firstValueFrom(this.authService.logout(request));
    }

    public async getMe(request: GetMeRequest): Promise<GetMeResponse> {
        const response = await firstValueFrom(this.authService.getMe(request));

        return {
            id: response.id,
            phone: response.phone,
            email: response.email,
            username: response.username,
            firstName: response.firstName,
            lastName: response.lastName,
            isPhoneVerified: response.isPhoneVerified,
            isEmailVerified: response.isEmailVerified,
        };
    }
}
