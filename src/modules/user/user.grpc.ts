import {
    UserServiceClient,
    GetMeRequest,
    UpdateMeRequest,
    UploadAvatarRequest,
    ListUsersRequest,
    GetUserByIdRequest,
    BlockUserRequest,
    UnblockUserRequest,
    DeleteUserRequest,
    GetPublicProfileByIdRequest,
    GetPublicProfileByUsernameRequest,
    UserProfileResponse,
    PublicProfileResponse,
    ListUsersResponse,
    UserActionResponse,
} from '@apcinema/contracts/gen/user';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserGrpcClient implements OnModuleInit {
    private userService: UserServiceClient;

    public constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

    public onModuleInit(): void {
        this.userService = this.client.getService<UserServiceClient>('UserService');
    }

    public getMe(request: GetMeRequest): Promise<UserProfileResponse> {
        return firstValueFrom(this.userService.getMe(request));
    }

    public updateMe(request: UpdateMeRequest): Promise<UserProfileResponse> {
        return firstValueFrom(this.userService.updateMe(request));
    }

    public getPublicProfileById(
        request: GetPublicProfileByIdRequest,
    ): Promise<PublicProfileResponse> {
        return firstValueFrom(this.userService.getPublicProfileById(request));
    }

    public getPublicProfileByUsername(
        request: GetPublicProfileByUsernameRequest,
    ): Promise<PublicProfileResponse> {
        return firstValueFrom(this.userService.getPublicProfileByUsername(request));
    }

    public uploadAvatar(request: UploadAvatarRequest): Promise<UserProfileResponse> {
        return firstValueFrom(this.userService.uploadAvatar(request));
    }

    public listUsers(request: ListUsersRequest): Promise<ListUsersResponse> {
        return firstValueFrom(this.userService.listUsers(request));
    }

    public getUserById(request: GetUserByIdRequest): Promise<UserProfileResponse> {
        return firstValueFrom(this.userService.getUserById(request));
    }

    public blockUser(request: BlockUserRequest): Promise<UserActionResponse> {
        return firstValueFrom(this.userService.blockUser(request));
    }

    public unblockUser(request: UnblockUserRequest): Promise<UserActionResponse> {
        return firstValueFrom(this.userService.unblockUser(request));
    }

    public deleteUser(request: DeleteUserRequest): Promise<UserActionResponse> {
        return firstValueFrom(this.userService.deleteUser(request));
    }
}
