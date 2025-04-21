import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

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
    estimate?: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    columnId?: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    assigneeId?: number;
}
