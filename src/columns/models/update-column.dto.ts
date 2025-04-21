import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateColumnDto {
    @ApiProperty({ type: () => String, required: true })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    title: string;
}
