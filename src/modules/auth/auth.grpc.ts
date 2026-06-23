import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AuthServiceClient, SendOtpRequest } from "@apcinema/contracts/gen/auth";
import type { ClientGrpc } from "@nestjs/microservices";

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
    private authService: AuthServiceClient

    public constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) { }

    public onModuleInit(): void {
        this.authService = this.client.getService<AuthServiceClient>('AuthService')
    }

    public sendOtp(request: SendOtpRequest) {
        return this.authService.sendOtp(request)
    }


}