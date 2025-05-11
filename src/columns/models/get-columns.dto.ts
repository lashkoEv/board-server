import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetColumnsDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    readonly projectId: number;

    @ApiProperty({ required: false })
    readonly taskQuery?: string;

    @ApiProperty({ required: false })
    readonly assigneeIds?: number[];
}
