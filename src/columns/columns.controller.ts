import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    NotFoundException,
    HttpStatus,
    Put,
    Query,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './models/create-column.dto';
import { GetColumnsDto } from './models/get-columns.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators';
import { UserRoles } from '../common/resources/users';
import { ColumnDto } from './models/column.dto';
import { ProjectsService } from '../projects/projects.service';
import { UpdateColumnDto } from './models/update-column.dto';
import { EmptyDto, IdDto } from '../common/base';
import { ColumnsDto } from './models/columns.dto';
import { ColumnStatus } from '../common/resources/columns';

@ApiTags('columns')
@Controller('columns')
export class ColumnsController {
    constructor(
        private readonly columnsService: ColumnsService,
        private readonly projectsService: ProjectsService,
    ) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => ColumnDto })
    @ApiOperation({ summary: 'Creates a new column' })
    @Post()
    async create(@Body() dto: CreateColumnDto) {
        const project = await this.projectsService.findById(dto.projectId);

        if (!project) {
            throw new NotFoundException({
                message: 'PROJECT_NOT_FOUND',
                errorCode: 'PROJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        let column = await this.columnsService.create(dto);

        const scopes = ['withProject'];

        column = await this.columnsService.findById(column.id, scopes);

        return new ColumnDto(column);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => ColumnsDto })
    @ApiOperation({ summary: 'Get all columns using filters' })
    @Get()
    async getAll(@Query() query: GetColumnsDto, @Request() req) {
        const scopes: any[] = [{ method: ['byProjectId', query.projectId] }];

        let columns = [];

        const count = await this.columnsService.count(scopes);

        if (count) {
            scopes.push('withTasks');

            columns = await this.columnsService.findAll(scopes);
        }

        return new ColumnsDto(count, columns);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => EmptyDto })
    @ApiOperation({ summary: 'Delete column with specified identifier' })
    @Delete(':id')
    async delete(@Param() param: IdDto, @Request() req) {
        const column = await this.columnsService.findById(param.id, [
            'withProject',
        ]);

        if (!column) {
            throw new NotFoundException({
                message: 'COLUMN_NOT_FOUND',
                errorCode: 'COLUMN_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        if (req.user.userId !== column.project.ownerId) {
            throw new BadRequestException({
                message: 'USER_IS_NOT_THE_PROJECT_OWNER',
                errorCode: 'USER_IS_NOT_THE_PROJECT_OWNER',
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (column.status !== ColumnStatus.custom) {
            throw new BadRequestException({
                message: 'CANNOT_DELETE_COLUMN',
                errorCode: 'CANNOT_DELETE_COLUMN',
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        await column.destroy();

        return new EmptyDto();
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => ColumnDto })
    @ApiOperation({ summary: 'Updates a column' })
    @Put(':id')
    async update(
        @Param() param: IdDto,
        @Body() body: UpdateColumnDto,
        @Request() req,
    ) {
        let column = await this.columnsService.findById(param.id, [
            'withProject',
        ]);

        if (!column) {
            throw new NotFoundException({
                message: 'COLUMN_NOT_FOUND',
                errorCode: 'COLUMN_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        if (req.user.userId !== column.project.ownerId) {
            throw new BadRequestException({
                message: 'USER_IS_NOT_THE_PROJECT_OWNER',
                errorCode: 'USER_IS_NOT_THE_PROJECT_OWNER',
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }

        await this.columnsService.update(column, body);

        column = await this.columnsService.findById(column.id);

        return new ColumnDto(column);
    }
}
