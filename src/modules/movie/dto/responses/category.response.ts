import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public title: string;

    @ApiProperty()
    public slug: string;

    @ApiPropertyOptional({ nullable: true })
    public description?: string | null;
}
