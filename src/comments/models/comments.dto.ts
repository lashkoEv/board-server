import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class CommentsDto {
    constructor(count: number, data: any[]) {
        this.count = count;

        this.data = data.map((comment) => new CommentDto(comment));
    }

    @ApiProperty({ type: () => Number, required: true })
    count: number;

    @ApiProperty({ type: () => [CommentDto], required: true })
    data: CommentDto[];
}
