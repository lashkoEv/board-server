import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/models';

export class ProjectDto {
    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.ownerId = data.ownerId;
        this.owner = data.get('owner')
            ? new UserDto(data.get('owner'))
            : undefined;
        this.members =
            data.get('members') && data.get('members').length
                ? data.get('members').map((member) => new UserDto(member))
                : undefined;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly title: string;

    @ApiProperty({ type: () => String, required: false })
    readonly description: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly ownerId: number;

    @ApiProperty({ type: () => UserDto, required: false })
    readonly owner?: UserDto;

    @ApiProperty({ type: () => [UserDto], required: false })
    readonly members?: UserDto[];

    @ApiProperty({ type: () => String, required: true })
    readonly createdAt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly updatedAt: string;
}
