import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/models';

export class CommentDto {
    constructor(data: any) {
        this.id = data.id;
        this.content = data.content;
        this.taskId = data.taskId;
        this.authorId = data.authorId;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.author = data.get('author')
            ? new UserDto(data.get('author'))
            : undefined;
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    content: string;

    @ApiProperty()
    taskId: number;

    @ApiProperty()
    authorId: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty({ required: false })
    author?: UserDto;
}
