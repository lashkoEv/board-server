import { ApiProperty } from '@nestjs/swagger';
import { AttachmentDto } from './attachment.dto';

export class AttachmentsDto {
    constructor(count: number, data: any[]) {
        this.count = count;

        this.data = data.map((attachment) => new AttachmentDto(attachment));
    }

    @ApiProperty({ type: () => Number, required: true })
    count: number;

    @ApiProperty({ type: () => [AttachmentDto], required: true })
    data: AttachmentDto[];
}
