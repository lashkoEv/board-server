import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/base';

export class GetCommentsDto extends PaginationDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    readonly taskId: number;
}
