import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
    @ApiProperty({ type: () => String, required: true })
    readonly accessToken: string;

    @ApiProperty({ type: () => String, required: true })
    readonly refreshToken: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly expiresAt: number;

    constructor(accessToken: string, refreshToken: string, expiresAt: number) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
    }
}
