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
import { ProjectsService } from './projects.service';
import {
    CreateOrUpdateProjectDto,
    GetProjectsDto,
    ProjectDto,
    ProjectsDto,
} from './models';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators';
import { UserRoles } from '../common/resources/users';
import { EmptyDto, IdDto } from '../common/base';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => ProjectDto })
    @ApiOperation({ summary: 'Creates a new project' })
    @Post()
    async create(@Body() dto: CreateOrUpdateProjectDto, @Request() req) {
        let project = await this.projectsService.create(dto, req.user.userId);

        const scopes = ['withOwner', 'withMembers'];

        project = await this.projectsService.findById(project.id, scopes);

        return new ProjectDto(project);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => ProjectsDto })
    @ApiOperation({ summary: 'Get all projects using filters' })
    @Get()
    async getAll(@Query() query: GetProjectsDto, @Request() req) {
        const scopes: any[] = [
            { method: ['byOwnerOrMemberId', req.user.userId] },
        ];

        let projects = [];

        const count = await this.projectsService.count(scopes);

        if (count) {
            if (query.limit || query.offset) {
                scopes.push({ method: ['byPage', query.limit, query.offset] });
            }

            projects = await this.projectsService.findAll(scopes);
        }

        return new ProjectsDto(count, projects);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => ProjectDto })
    @ApiOperation({ summary: 'Get project with specified identifier' })
    @Get(':id')
    async getById(@Param() param: IdDto) {
        const scopes = ['withOwner', 'withMembers'];

        const project = await this.projectsService.findById(param.id, scopes);

        if (!project) {
            throw new NotFoundException({
                message: 'PROJECT_NOT_FOUND',
                errorCode: 'PROJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        return new ProjectDto(project);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => EmptyDto })
    @ApiOperation({ summary: 'Delete project with specified identifier' })
    @Delete(':id')
    async delete(@Param() param: IdDto) {
        const project = await this.projectsService.findById(param.id);

        if (!project) {
            throw new NotFoundException({
                message: 'PROJECT_NOT_FOUND',
                errorCode: 'PROJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        await project.destroy();

        return new EmptyDto();
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => ProjectDto })
    @ApiOperation({ summary: 'Updates a project' })
    @Put(':id')
    async update(
        @Param() param: IdDto,
        @Body() body: CreateOrUpdateProjectDto,
    ) {
        let project = await this.projectsService.findById(param.id, []);

        if (!project) {
            throw new NotFoundException({
                message: 'PROJECT_NOT_FOUND',
                errorCode: 'PROJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        await this.projectsService.update(project, body);

        const scopes = ['withOwner', 'withMembers'];

        project = await this.projectsService.findById(project.id, scopes);

        return new ProjectDto(project);
    }
}
