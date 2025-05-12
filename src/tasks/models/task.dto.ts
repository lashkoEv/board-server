import { ApiProperty } from '@nestjs/swagger';
import { ColumnDto } from '../../columns/models/column.dto';
import { UserDto } from '../../users/models';
import { AttachmentDto } from '../../attachments/models/attachment.dto';

export class TaskDto {
    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.estimate = data.estimate;
        this.projectId = data.projectId;
        this.columnId = data.columnId;
        this.authorId = data.authorId;
        this.assigneeId = data.assigneeId;
        this.column = data.get?.('column')
            ? new ColumnDto(data.get('column'))
            : undefined;

        this.author = data.get?.('author')
            ? new UserDto(data.get('author'))
            : undefined;

        this.assignee = data.get?.('assignee')
            ? new UserDto(data.get('assignee'))
            : undefined;
        this.attachments = data
            .get('attachments')
            ?.map((a) => new AttachmentDto(a));
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    @ApiProperty({ type: () => Number })
    readonly id: number;

    @ApiProperty({ type: () => String })
    readonly title: string;

    @ApiProperty({ type: () => String, required: false })
    readonly description?: string;

    @ApiProperty({ type: () => Number })
    readonly estimate: number;

    @ApiProperty({ type: () => Number })
    readonly projectId: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly columnId?: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly authorId?: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly assigneeId?: number;

    @ApiProperty({ type: () => ColumnDto, required: false })
    readonly column?: ColumnDto;

    @ApiProperty({ type: () => UserDto, required: false })
    readonly author?: UserDto;

    @ApiProperty({ type: () => UserDto, required: false })
    readonly assignee?: UserDto;

    @ApiProperty({ type: () => [AttachmentDto], required: false })
    readonly attachments?: AttachmentDto[];

    @ApiProperty({ type: () => String })
    readonly createdAt: string;

    @ApiProperty({ type: () => String })
    readonly updatedAt: string;
}
