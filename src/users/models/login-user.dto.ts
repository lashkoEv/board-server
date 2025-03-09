import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty({ message: 'PASSWORD_REQUIRED' })
    readonly password: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lifeTime: number;
}
