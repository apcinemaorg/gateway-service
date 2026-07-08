import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { UserProfileResponseDto } from '../responses/user-profile.response';

export class UpdateUserProfileRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public username?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public displayName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public bio?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public firstName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public lastName?: string;

    @ApiPropertyOptional({ example: '1990-01-15' })
    @IsOptional()
    @IsString()
    public dateOfBirth?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public gender?: string;

    @ApiPropertyOptional({ example: 'en' })
    @IsOptional()
    @IsString()
    public language?: string;

    @ApiPropertyOptional({ example: 'system' })
    @IsOptional()
    @IsString()
    public theme?: string;

    @ApiPropertyOptional({ example: '{"email":true,"push":false}' })
    @IsOptional()
    @IsString()
    public notificationsJson?: string;
}

export class ListUsersQuery {
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    public page?: number = 1;

    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    public limit?: number = 20;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public search?: string;
}

export class ListUsersResponseDto {
    @ApiProperty({ type: [UserProfileResponseDto] })
    public users: UserProfileResponseDto[];

    @ApiProperty()
    public total: number;

    @ApiProperty()
    public page: number;

    @ApiProperty()
    public limit: number;
}

export class UserActionResponseDto {
    @ApiProperty()
    public ok: boolean;
}
