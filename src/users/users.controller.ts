import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserRoles } from '../common/resources/users';
import { CreateUserDto, UserDto } from './models';
import { Public, Roles } from '../common/decorators';
import { UsersDto } from './models/users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => UserDto })
    @ApiOperation({ summary: 'Get current user`s profile' })
    @Get('me')
    async getMyProfile(@Request() req): Promise<UserDto> {
        const user = await this.usersService.getUser(req.user.userId);

        return new UserDto(user);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Register user' })
    @Post('signup')
    async create(@Body() body: CreateUserDto): Promise<object> {
        const user = await this.usersService.getUserByEmail(body.email);

        if (user) {
            throw new BadRequestException({
                message: 'WRONG_DATA_FOR_REGISTER',
                errorCode: 'WRONG_DATA_FOR_REGISTER',
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        await this.usersService.create(body);

        return {};
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => UsersDto })
    @ApiOperation({ summary: 'Get all users' })
    @Get()
    async getAll(@Request() req): Promise<UsersDto> {
        const scopes: any[] = [{ method: ['excludesId', req.user.userId] }];

        const count = await this.usersService.getCount(scopes);

        let users = [];

        if (count) {
            users = await this.usersService.getList(scopes);
        }

        return new UsersDto(count, users);
    }
}
