import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../projects/models';

export class ColumnDto {
    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.projectId = data.projectId;
        this.project = data.get('project')
            ? new ProjectDto(data.get('project'))
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

    @ApiProperty({ type: () => ProjectDto, required: false })
    readonly project?: ProjectDto;

    @ApiProperty({ type: () => String, required: true })
    readonly createdAt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly updatedAt: string;
}
