import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators';
import { UserRoles } from '../common/resources/users';
import { EmptyDto, IdDto } from '../common/base';
import { TasksService } from './tasks.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateTaskDto } from './models/create-task.dto';
import { UpdateTaskDto } from './models/update-task.dto';
import { TaskDto } from './models/task.dto';
import { TasksDto } from './models/tasks.dto';
import { UsersService } from '../users/users.service';
import { ColumnsService } from '../columns/columns.service';
import { GetTasksDto } from './models/get-tasks.dto';
import { parseIds } from '../common/helpers/parse-id.helper';
import { AttachmentsDiskInterceptor } from '../common/multer/multer.config';
import { AttachmentsService } from '../attachments/attachments.service';
import { Sequelize } from 'sequelize-typescript';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        private readonly tasksService: TasksService,
        private readonly projectsService: ProjectsService,
        private readonly columnsService: ColumnsService,
        private readonly usersService: UsersService,
        private readonly attachmentsService: AttachmentsService,
    ) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new task' })
    @ApiResponse({ type: () => TaskDto })
    @UseInterceptors(AttachmentsDiskInterceptor())
    @Post()
    async create(
        @Body() dto: CreateTaskDto,
        @Request() req,
        @UploadedFiles() attachments: Express.Multer.File[],
    ) {
        return await this.sequelize.transaction(async (transaction) => {
            const scopes = ['withAuthor'];

            const project = await this.projectsService.findById(
                dto.projectId,
                [],
                transaction,
            );

            if (!project) {
                throw new NotFoundException({
                    message: 'PROJECT_NOT_FOUND',
                    errorCode: 'PROJECT_NOT_FOUND',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            if (dto.columnId) {
                const column = await this.columnsService.findById(
                    dto.columnId,
                    [],
                    transaction,
                );

                if (!column) {
                    throw new NotFoundException({
                        message: 'COLUMN_NOT_FOUND',
                        errorCode: 'COLUMN_NOT_FOUND',
                        statusCode: HttpStatus.NOT_FOUND,
                    });
                }

                scopes.push('withColumn');
            }

            if (dto.assigneeId) {
                const user = await this.usersService.getUser(
                    dto.assigneeId,
                    [],
                    transaction,
                );

                if (!user) {
                    throw new NotFoundException({
                        message: 'USER_NOT_FOUND',
                        errorCode: 'USER_NOT_FOUND',
                        statusCode: HttpStatus.NOT_FOUND,
                    });
                }

                scopes.push('withAssignee');
            }

            let task = await this.tasksService.create(
                dto,
                req.user.userId,
                transaction,
            );

            if (attachments?.length) {
                await this.attachmentsService.bulkCreate(
                    task.id,
                    attachments,
                    transaction,
                );

                scopes.push('withAttachments');
            }

            task = await this.tasksService.findById(
                task.id,
                scopes,
                transaction,
            );

            return new TaskDto(task);
        });
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get tasks by projectId' })
    @ApiResponse({ type: () => TasksDto })
    @Get()
    async getAll(@Query() query: GetTasksDto) {
        const scopes: any = [{ method: ['byProjectId', query.projectId] }];

        if (query.isBacklog) {
            scopes.push('inBacklog');
        }

        if (query.query) {
            scopes.push({ method: ['byQuery', query.query] });
        }

        if (query.assigneeIds?.length) {
            scopes.push({
                method: ['byAssigneeIds', parseIds(query.assigneeIds)],
            });
        }

        if (query.columnIds?.length) {
            scopes.push({ method: ['byColumnIds', parseIds(query.columnIds)] });
        }

        const count = await this.tasksService.count(scopes);

        let tasks = [];

        if (count) {
            scopes.push('withAuthor', 'withAssignee', 'withColumn');

            if (query.limit || query.offset) {
                scopes.push({ method: ['byPage', query.limit, query.offset] });
            }

            tasks = await this.tasksService.findAll(scopes);
        }

        return new TasksDto(count, tasks);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get task by id' })
    @ApiResponse({ type: () => TaskDto })
    @Get(':id')
    async getById(@Param() param: IdDto) {
        const task = await this.tasksService.findById(param.id, [
            'withAuthor',
            'withAssignee',
            'withColumn',
            'withAttachments',
        ]);

        if (!task) {
            throw new NotFoundException({
                message: 'TASK_NOT_FOUND',
                errorCode: 'TASK_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        return new TaskDto(task);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update task' })
    @ApiResponse({ type: () => TaskDto })
    @UseInterceptors(AttachmentsDiskInterceptor())
    @Put(':id')
    async update(
        @Param() param: IdDto,
        @Body() dto: UpdateTaskDto,
        @UploadedFiles() attachments: Express.Multer.File[],
    ) {
        return await this.sequelize.transaction(async (transaction) => {
            let task = await this.tasksService.findById(
                param.id,
                [],
                transaction,
            );

            if (!task) {
                throw new NotFoundException({
                    message: 'TASK_NOT_FOUND',
                    errorCode: 'TASK_NOT_FOUND',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            await this.tasksService.update(task, dto, transaction);

            await this.attachmentsService.deleteExcept(
                task.id,
                dto.existingAttachments ?? [],
                transaction,
            );

            if (attachments) {
                await this.attachmentsService.bulkCreate(
                    task.id,
                    attachments,
                    transaction,
                );
            }

            task = await this.tasksService.findById(
                task.id,
                ['withColumn', 'withAuthor', 'withAssignee', 'withAttachments'],
                transaction,
            );

            return new TaskDto(task);
        });
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete task' })
    @ApiResponse({ type: () => EmptyDto })
    @Delete(':id')
    async delete(@Param() param: IdDto) {
        return await this.sequelize.transaction(async (transaction) => {
            const task = await this.tasksService.findById(
                param.id,
                [],
                transaction,
            );

            if (!task) {
                throw new NotFoundException({
                    message: 'TASK_NOT_FOUND',
                    errorCode: 'TASK_NOT_FOUND',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            await this.attachmentsService.deleteByTaskId(task.id, transaction);

            await task.destroy();

            return new EmptyDto();
        });
    }
}
