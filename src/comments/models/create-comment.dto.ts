import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    content: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    taskId: number;
}
