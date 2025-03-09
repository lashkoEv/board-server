import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly username?: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty({ message: 'PASSWORD_REQUIRED' })
    readonly password: string;
}
