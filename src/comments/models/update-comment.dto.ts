import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    content: string;
}
