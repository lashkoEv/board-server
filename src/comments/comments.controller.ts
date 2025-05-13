import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    Request,
    NotFoundException,
    HttpStatus,
    ForbiddenException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators';
import { UserRoles } from '../common/resources/users';
import { CommentsService } from './comments.service';
import { EmptyDto, IdDto } from '../common/base';
import { CommentDto } from './models/comment.dto';
import { CreateCommentDto } from './models/create-comment.dto';
import { UpdateCommentDto } from './models/update-comment.dto';
import { CommentsDto } from './models/comments.dto';
import { GetCommentsDto } from './models/get-comments.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create comment' })
    @ApiResponse({ type: () => CommentDto })
    @Post()
    async create(@Body() dto: CreateCommentDto, @Request() req) {
        let comment = await this.commentsService.create(dto, req.user.userId);

        const scopes = ['withAuthor'];

        comment = await this.commentsService.findById(comment.id, scopes);

        return new CommentDto(comment);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update comment' })
    @ApiResponse({ type: () => CommentDto })
    @Put(':id')
    async update(
        @Param() param: IdDto,
        @Body() dto: UpdateCommentDto,
        @Request() req,
    ) {
        let comment = await this.commentsService.findById(param.id);

        if (!comment) {
            throw new NotFoundException({
                message: 'COMMENT_NOT_FOUND',
                errorCode: 'COMMENT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        if (comment.authorId !== req.user.userId) {
            throw new ForbiddenException({
                message: 'FORBIDDEN',
                errorCode: 'FORBIDDEN',
                statusCode: HttpStatus.FORBIDDEN,
            });
        }

        await this.commentsService.update(comment, dto);

        const scopes = ['withAuthor'];

        comment = await this.commentsService.findById(comment.id, scopes);

        return new CommentDto(comment);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete comment' })
    @ApiResponse({ status: 204 })
    @Delete(':id')
    async delete(@Param() param: IdDto, @Request() req) {
        const comment = await this.commentsService.findById(param.id);

        if (!comment) {
            throw new NotFoundException({
                message: 'COMMENT_NOT_FOUND',
                errorCode: 'COMMENT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        if (comment.authorId !== req.user.userId) {
            throw new ForbiddenException({
                message: 'FORBIDDEN',
                errorCode: 'FORBIDDEN',
                statusCode: HttpStatus.FORBIDDEN,
            });
        }

        await comment.destroy();

        return new EmptyDto();
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List comments by taskId' })
    @ApiResponse({ type: () => CommentsDto })
    @Get()
    async getAll(@Query() query: GetCommentsDto) {
        const scopes: any = [{ method: ['byTaskId', query.taskId] }];

        const count = await this.commentsService.count(scopes);

        let comments = [];

        if (count) {
            scopes.push('withAuthor');

            if (query.limit || query.offset) {
                scopes.push({ method: ['byPage', query.limit, query.offset] });
            }

            comments = await this.commentsService.findAll(scopes);
        }

        return new CommentsDto(count, comments);
    }
}
