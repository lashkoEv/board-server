import {
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateOrUpdateProjectDto, Project, ProjectMember } from './models';
import { BaseService } from '../common/base';
import { Repository, Sequelize } from 'sequelize-typescript';
import { User } from '../users/models';
import sequelize from 'sequelize';
import { ProjectColumn } from '../columns/models/column.entity';
import { ColumnStatus, ColumnStatusTitle } from '../common/resources/columns';

@Injectable()
export class ProjectsService extends BaseService<Project> {
    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        @Inject('PROJECT_MODEL')
        private readonly projectModel: Repository<Project>,
        @Inject('PROJECT_MEMBER_MODEL')
        private readonly projectMemberModel: Repository<ProjectMember>,
        @Inject('USER_MODEL')
        private readonly userModel: Repository<User>,
        @Inject('COLUMN_MODEL')
        private readonly columnModel: Repository<ProjectColumn>,
    ) {
        super(projectModel);
    }

    async create(
        data: CreateOrUpdateProjectDto,
        ownerId: number,
    ): Promise<Project> {
        return await this.sequelize.transaction(async (transaction) => {
            const project = await this.projectModel.create(
                {
                    title: data.title,
                    description: data.description,
                    ownerId,
                },
                { transaction },
            );

            if (data.memberIds) {
                await this.checkAndCreateMembers(
                    data.memberIds,
                    project.id,
                    transaction,
                );
            }

            await this.columnModel.bulkCreate(
                [
                    {
                        title: ColumnStatusTitle[ColumnStatus.toDo],
                        status: ColumnStatus.toDo,
                        projectId: project.id,
                    },
                    {
                        title: ColumnStatusTitle[ColumnStatus.inProgress],
                        status: ColumnStatus.inProgress,
                        projectId: project.id,
                    },
                    {
                        title: ColumnStatusTitle[ColumnStatus.done],
                        status: ColumnStatus.done,
                        projectId: project.id,
                    },
                ],
                { transaction },
            );

            return project;
        });
    }

    async update(
        project: Project,
        data: CreateOrUpdateProjectDto,
    ): Promise<Project> {
        return await this.sequelize.transaction(async (transaction) => {
            if (data.title || data.description) {
                await project.update(
                    {
                        title: data.title ?? project.title,
                        description: data.description ?? project.description,
                    },
                    { transaction },
                );
            }

            await this.projectMemberModel.destroy({
                where: { projectId: project.id },
                transaction,
            });

            if (data.memberIds && data.memberIds.length > 0) {
                await this.checkAndCreateMembers(
                    data.memberIds,
                    project.id,
                    transaction,
                );
            }

            return project;
        });
    }

    async checkAndCreateMembers(
        memberIds: number[],
        projectId: number,
        transaction?: sequelize.Transaction,
    ): Promise<void> {
        const users = await this.userModel.findAll({
            where: { id: memberIds },
        });

        if (users.length !== memberIds.length) {
            throw new NotFoundException({
                message: 'USERS_NOT_FOUND',
                errorCode: 'USERS_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND,
            });
        }

        const members = memberIds.map((memberId) => ({
            memberId,
            projectId,
        }));

        await this.projectMemberModel.bulkCreate(members, {
            transaction,
        });
    }

    async findAll(scopes?: any[]): Promise<Project[]> {
        return await this.projectModel.scope(scopes).findAll();
    }

    async count(scopes?: any[]): Promise<number> {
        return await this.projectModel.scope(scopes).count();
    }

    async findById(
        id: number,
        scopes?: any[],
        transaction?: sequelize.Transaction,
    ): Promise<Project> {
        return await this.projectModel
            .scope(scopes)
            .findByPk(id, { transaction });
    }
}
