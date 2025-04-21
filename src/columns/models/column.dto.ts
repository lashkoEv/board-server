import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../projects/models';
import { TaskDto } from '../../tasks/models/task.dto';

export class ColumnDto {
    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.projectId = data.projectId;
        this.status = data.status;
        this.project = data.get('project')
            ? new ProjectDto(data.get('project'))
            : undefined;
        this.tasks =
            data.get('tasks') && data.get('tasks').length
                ? data.get('tasks').map((task) => new TaskDto(task))
                : undefined;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly title: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly projectId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly status: number;

    @ApiProperty({ type: () => ProjectDto, required: false })
    readonly project?: ProjectDto;

    @ApiProperty({ type: () => [TaskDto], required: false })
    readonly tasks?: TaskDto[];

    @ApiProperty({ type: () => String, required: true })
    readonly createdAt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly updatedAt: string;
}
