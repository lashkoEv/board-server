import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDto {
    constructor(data: any) {
        this.id = data.id;
        this.taskId = data.taskId;
        this.storedName = data.storedName;
        this.originalName = data.originalName;
        this.mimeType = data.mimeType;
        this.size = data.size;
        this.url = data.url;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly taskId: number;

    @ApiProperty()
    readonly storedName: string;

    @ApiProperty()
    readonly originalName: string;

    @ApiProperty({ required: false })
    readonly mimeType?: string;

    @ApiProperty({ required: false })
    readonly size?: number;

    @ApiProperty({ required: false })
    readonly url?: string;

    @ApiProperty()
    readonly createdAt: string;

    @ApiProperty()
    readonly updatedAt: string;
}
