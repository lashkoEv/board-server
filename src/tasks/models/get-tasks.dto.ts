import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../common/base';

export class GetTasksDto extends PaginationDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    readonly projectId: number;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    readonly isBacklog?: boolean;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly query?: string;

    @ApiProperty({ required: false })
    readonly assigneeIds?: number[];

    @ApiProperty({ required: false })
    readonly columnIds?: number[];
}
