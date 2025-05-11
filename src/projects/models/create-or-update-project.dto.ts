import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateOrUpdateProjectDto {
    @ApiProperty({ type: () => String, required: true })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    title: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @IsOptional()
    @MinLength(5)
    description?: string;

    @ApiProperty({ type: () => [Number], required: false })
    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    memberIds?: number[];
}
