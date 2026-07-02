import {
    AccountServiceClient,
    ChangePasswordRequest,
    ChangePasswordResponse,
    SendChangeIdentifierOtpRequest,
    SendChangeIdentifierOtpResponse,
    VerifyChangeIdentifierRequest,
    VerifyChangeIdentifierResponse,
} from '@apcinema/contracts/gen/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccountGrpcClient implements OnModuleInit {
    private accountService: AccountServiceClient;

    public constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

    public onModuleInit(): void {
        this.accountService = this.client.getService<AccountServiceClient>('AccountService');
    }

    public changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        return firstValueFrom(this.accountService.changePassword(request));
    }

    public sendChangeIdentifierOtp(
        request: SendChangeIdentifierOtpRequest,
    ): Promise<SendChangeIdentifierOtpResponse> {
        return firstValueFrom(this.accountService.sendChangeIdentifierOtp(request));
    }

    public verifyChangeIdentifier(
        request: VerifyChangeIdentifierRequest,
    ): Promise<VerifyChangeIdentifierResponse> {
        return firstValueFrom(this.accountService.verifyChangeIdentifier(request));
    }
}
