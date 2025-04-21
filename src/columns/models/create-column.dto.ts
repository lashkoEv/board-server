import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateColumnDto {
    @ApiProperty({ type: () => String, required: true })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    title: string;

    @ApiProperty({ type: () => Number, required: true })
    @IsInt()
    @Min(1)
    projectId: number;
}
