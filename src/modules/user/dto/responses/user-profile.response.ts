import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public accountId: string;

    @ApiPropertyOptional()
    public username?: string;

    @ApiPropertyOptional()
    public displayName?: string;

    @ApiPropertyOptional()
    public avatarUrl?: string;

    @ApiPropertyOptional()
    public bio?: string;

    @ApiPropertyOptional()
    public firstName?: string;

    @ApiPropertyOptional()
    public lastName?: string;

    @ApiPropertyOptional()
    public dateOfBirth?: string;

    @ApiPropertyOptional()
    public gender?: string;

    @ApiProperty()
    public language: string;

    @ApiProperty()
    public theme: string;

    @ApiProperty()
    public notificationsJson: string;

    @ApiProperty()
    public isBlocked: boolean;

    @ApiPropertyOptional()
    public deletedAt?: string;

    @ApiProperty()
    public createdAt: string;

    @ApiProperty()
    public updatedAt: string;
}
