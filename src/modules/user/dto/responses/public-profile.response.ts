import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicProfileResponseDto {
    @ApiProperty()
    public id: string;

    @ApiPropertyOptional()
    public username?: string;

    @ApiPropertyOptional()
    public displayName?: string;

    @ApiPropertyOptional()
    public avatarUrl?: string;

    @ApiPropertyOptional()
    public bio?: string;
}
