import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Public } from '@apcinema/shared';
import type { AuthTokenPayload } from '@apcinema/shared';

import { UpdateUserProfileRequest } from './dto/requests/user.requests';
import { PublicProfileResponseDto } from './dto/responses/public-profile.response';
import { UserProfileResponseDto } from './dto/responses/user-profile.response';
import { UserGrpcClient } from './user.grpc';

@ApiTags('Users')
@Controller('users')
export class UserController {
    public constructor(private readonly userGrpcClient: UserGrpcClient) {}

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiOkResponse({ type: UserProfileResponseDto })
    public getMe(@CurrentUser() user: AuthTokenPayload): Promise<UserProfileResponseDto> {
        return this.userGrpcClient.getMe({ accountId: user.sub });
    }

    @Patch('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiOkResponse({ type: UserProfileResponseDto })
    public updateMe(
        @CurrentUser() user: AuthTokenPayload,
        @Body() dto: UpdateUserProfileRequest,
    ): Promise<UserProfileResponseDto> {
        return this.userGrpcClient.updateMe({
            accountId: user.sub,
            ...dto,
        });
    }

    @Post('me/avatar')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiOperation({ summary: 'Upload avatar' })
    @ApiOkResponse({ type: UserProfileResponseDto })
    @UseInterceptors(FileInterceptor('file'))
    public uploadAvatar(
        @CurrentUser() user: AuthTokenPayload,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<UserProfileResponseDto> {
        return this.userGrpcClient.uploadAvatar({
            accountId: user.sub,
            data: file.buffer,
            mimeType: file.mimetype,
        });
    }

    @Public()
    @Get('by-username/:username')
    @ApiOperation({ summary: 'Get public profile by username' })
    @ApiOkResponse({ type: PublicProfileResponseDto })
    public getByUsername(
        @Param('username') username: string,
    ): Promise<PublicProfileResponseDto> {
        return this.userGrpcClient.getPublicProfileByUsername({ username });
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get public profile by id' })
    @ApiOkResponse({ type: PublicProfileResponseDto })
    public getById(@Param('id') id: string): Promise<PublicProfileResponseDto> {
        return this.userGrpcClient.getPublicProfileById({ id });
    }
}
