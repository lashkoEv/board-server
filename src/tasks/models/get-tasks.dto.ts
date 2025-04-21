import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetTasksDto {
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
}
