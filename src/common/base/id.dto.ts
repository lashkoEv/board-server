import { Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IdDto {
    @ApiProperty({ type: () => Number, required: true })
    @Min(1, { message: 'ID_MUST_BE_A_POSITIVE_NUMBER' })
    @Type(() => Number)
    readonly id: number;
}
