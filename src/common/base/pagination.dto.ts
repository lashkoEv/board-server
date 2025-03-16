import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    readonly limit: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    readonly offset: number;
}
