import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@apcinema/shared';

import {
    ListUsersQuery,
    ListUsersResponseDto,
    UserActionResponseDto,
} from './dto/requests/user.requests';
import { UserProfileResponseDto } from './dto/responses/user-profile.response';
import { UserGrpcClient } from './user.grpc';

@ApiTags('Admin Users')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin/users')
export class AdminUsersController {
    public constructor(private readonly userGrpcClient: UserGrpcClient) {}

    @Get()
    @ApiOperation({ summary: 'List users' })
    @ApiOkResponse({ type: ListUsersResponseDto })
    public listUsers(@Query() query: ListUsersQuery): Promise<ListUsersResponseDto> {
        return this.userGrpcClient.listUsers({
            page: query.page ?? 1,
            limit: query.limit ?? 20,
            search: query.search,
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiOkResponse({ type: UserProfileResponseDto })
    public getUserById(@Param('id') id: string): Promise<UserProfileResponseDto> {
        return this.userGrpcClient.getUserById({ id });
    }

    @Patch(':id/block')
    @ApiOperation({ summary: 'Block user' })
    @ApiOkResponse({ type: UserActionResponseDto })
    public blockUser(@Param('id') id: string): Promise<UserActionResponseDto> {
        return this.userGrpcClient.blockUser({ id });
    }

    @Patch(':id/unblock')
    @ApiOperation({ summary: 'Unblock user' })
    @ApiOkResponse({ type: UserActionResponseDto })
    public unblockUser(@Param('id') id: string): Promise<UserActionResponseDto> {
        return this.userGrpcClient.unblockUser({ id });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete user' })
    @ApiOkResponse({ type: UserActionResponseDto })
    public deleteUser(@Param('id') id: string): Promise<UserActionResponseDto> {
        return this.userGrpcClient.deleteUser({ id });
    }
}
