import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from './task.dto';

export class TasksDto {
    constructor(count: number, data: any[]) {
        this.count = count;

        this.data = data.map((task) => new TaskDto(task));
    }

    @ApiProperty({ type: () => Number, required: true })
    count: number;

    @ApiProperty({ type: () => [TaskDto], required: true })
    data: TaskDto[];
}
