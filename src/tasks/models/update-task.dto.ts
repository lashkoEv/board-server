import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateTaskDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    title?: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    estimate?: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    columnId?: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    assigneeId?: number;

    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ type: [Number], required: false })
    @Transform(({ value }) =>
        Array.isArray(value) ? value.map(Number) : [Number(value)],
    )
    existingAttachments?: number[];
}
