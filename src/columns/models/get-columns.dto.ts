import { ApiProperty } from '@nestjs/swagger';

export class GetColumnsDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly projectId: number;
}
