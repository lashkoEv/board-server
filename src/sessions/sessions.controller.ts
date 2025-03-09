import {
    Post,
    Body,
    Controller,
    Delete,
    Request,
    Put,
    UnprocessableEntityException,
    HttpStatus,
    Headers,
    HttpCode,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { UsersService } from '../users/users.service';
import { Public } from '../common/decorators';
import { RefreshSessionDto, SessionDto, UserSessionDto } from './models';
import { LoginUserDto } from '../users/models';
import { UserRoles } from '../common/resources/users';
import { PasswordHelper } from '../common/helpers/password.helper';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
    constructor(
        private readonly sessionsService: SessionsService,
        private readonly usersService: UsersService,
    ) {}

    @Public()
    @ApiCreatedResponse({ type: () => SessionDto })
    @ApiOperation({ summary: 'Start session' })
    @Post('')
    async create(@Body() body: LoginUserDto): Promise<SessionDto> {
        const scopes = [{ method: ['byRoles', [UserRoles.user]] }];
        const user = await this.usersService.getUserByEmail(body.email, scopes);

        if (!user) {
            throw new UnprocessableEntityException({
                message: 'WRONG_CREDENTIALS',
                errorCode: 'WRONG_CREDENTIALS',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            });
        }
        if (
            !PasswordHelper.compare(
                `${body.password}${user.salt}`,
                user.password,
            )
        ) {
            throw new UnprocessableEntityException({
                message: 'WRONG_CREDENTIALS',
                errorCode: 'WRONG_CREDENTIALS',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            });
        }

        return this.sessionsService.create(user.id, {
            role: user.role,
            lifeTime: body.lifeTime,
        });
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Destroy session' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('')
    async logout(
        @Request() req: Request & { user: UserSessionDto },
        @Headers() headers,
    ): Promise<void> {
        const accessToken = headers['authorization'].split(' ')[1];

        await this.sessionsService.destroy(req.user.userId, accessToken);
    }

    @Public()
    @ApiCreatedResponse({ type: () => SessionDto })
    @ApiOperation({ summary: 'Refresh session' })
    @Put('')
    async refresh(@Body() body: RefreshSessionDto): Promise<SessionDto> {
        const oldSessionParams = this.sessionsService.verifyToken(
            body.refreshToken,
        );

        const scopes = [{ method: ['byRoles', [UserRoles.user]] }];

        const user = await this.usersService.getUser(
            oldSessionParams.data.userId,
            scopes,
        );

        if (!user) {
            throw new UnprocessableEntityException({
                message: 'USER_NOT_FOUND',
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            });
        }

        return this.sessionsService.refresh(body.refreshToken);
    }
}
