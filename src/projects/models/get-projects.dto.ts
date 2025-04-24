import { PaginationDto } from '../../common/base';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetProjectsDto extends PaginationDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly query?: string;
}
