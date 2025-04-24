import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UsersDto {
    constructor(count: number, data: any[]) {
        this.count = count;

        this.data = data.map((user) => new UserDto(user));
    }

    @ApiProperty({ type: () => Number, required: true })
    count: number;

    @ApiProperty({ type: () => [UserDto], required: true })
    data: UserDto[];
}
