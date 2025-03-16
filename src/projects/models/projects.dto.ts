import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from './project.dto';

export class ProjectsDto {
    constructor(count: number, data: any[]) {
        this.count = count;

        this.data = data.map((project) => new ProjectDto(project));
    }

    @ApiProperty({ type: () => Number, required: true })
    count: number;

    @ApiProperty({ type: () => [ProjectDto], required: true })
    data: ProjectDto[];
}
