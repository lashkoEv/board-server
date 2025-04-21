import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
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

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        private readonly projectsService: ProjectsService,
        private readonly columnsService: ColumnsService,
        private readonly usersService: UsersService,
    ) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new task' })
    @ApiResponse({ type: () => TaskDto })
    @Post()
    async create(@Body() dto: CreateTaskDto, @Request() req) {
        const scopes = ['withAuthor'];

        const project = await this.projectsService.findById(dto.projectId);

        if (!project) {
            throw new NotFoundException({
                message: 'PROJECT_NOT_FOUND',
                errorCode: 'PROJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        if (dto.columnId) {
            const column = await this.columnsService.findById(dto.columnId);

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
            const user = await this.usersService.getUser(dto.assigneeId);

            if (!user) {
                throw new NotFoundException({
                    message: 'USER_NOT_FOUND',
                    errorCode: 'USER_NOT_FOUND',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            scopes.push('withAssignee');
        }

        let task = await this.tasksService.create(dto, req.user.userId);

        task = await this.tasksService.findById(task.id, scopes);

        return new TaskDto(task);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get tasks by projectId' })
    @ApiResponse({ type: () => TasksDto })
    @Get()
    async getAll(@Query() dto: GetTasksDto) {
        const scopes: any = [{ method: ['byProjectId', dto.projectId] }];

        if (dto.isBacklog) {
            console.log(typeof dto.isBacklog, dto.isBacklog);
            scopes.push('inBacklog');
        }

        const count = await this.tasksService.count(scopes);

        let tasks = [];

        if (count) {
            scopes.push('withAuthor', 'withAssignee');
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
    @Put(':id')
    async update(@Param() param: IdDto, @Body() dto: UpdateTaskDto) {
        let task = await this.tasksService.findById(param.id);

        if (!task) {
            throw new NotFoundException({
                message: 'TASK_NOT_FOUND',
                errorCode: 'TASK_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        await this.tasksService.update(task, dto);

        task = await this.tasksService.findById(task.id, [
            'withColumn',
            'withAuthor',
            'withAssignee',
        ]);

        return new TaskDto(task);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete task' })
    @ApiResponse({ type: () => EmptyDto })
    @Delete(':id')
    async delete(@Param() param: IdDto) {
        const task = await this.tasksService.findById(param.id);

        if (!task) {
            throw new NotFoundException({
                message: 'TASK_NOT_FOUND',
                errorCode: 'TASK_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        await task.destroy();

        return new EmptyDto();
    }
}
