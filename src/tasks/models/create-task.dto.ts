import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
    @ApiProperty({ type: () => String, required: true })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    title: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: () => Number, required: false, default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    estimate?: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    projectId: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    columnId?: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    assigneeId?: number;
}
