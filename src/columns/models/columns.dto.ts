import { ApiProperty } from '@nestjs/swagger';
import { ColumnDto } from './column.dto';

export class ColumnsDto {
    constructor(count: number, data: any[]) {
        this.count = count;

        this.data = data.map((project) => new ColumnDto(project));
    }

    @ApiProperty({ type: () => Number, required: true })
    count: number;

    @ApiProperty({ type: () => [ColumnDto], required: true })
    data: ColumnDto[];
}
