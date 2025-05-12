import { Inject, Injectable } from '@nestjs/common';
import { CreateColumnDto } from './models/create-column.dto';
import { BaseService } from '../common/base';
import { ProjectColumn } from './models/column.entity';
import { Repository, Sequelize } from 'sequelize-typescript';
import { UpdateColumnDto } from './models/update-column.dto';
import { ColumnStatus } from '../common/resources/columns';
import sequelize from 'sequelize';

@Injectable()
export class ColumnsService extends BaseService<ProjectColumn> {
    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        @Inject('COLUMN_MODEL')
        private readonly columnModel: Repository<ProjectColumn>,
    ) {
        super(columnModel);
    }

    async create(
        data: CreateColumnDto,
        status?: number,
    ): Promise<ProjectColumn> {
        return await this.columnModel.create({
            title: data.title,
            projectId: data.projectId,
            status: status ?? ColumnStatus.custom,
        });
    }

    async update(
        column: ProjectColumn,
        data: UpdateColumnDto,
    ): Promise<ProjectColumn> {
        return await column.update({
            title: data.title ?? column.title,
        });
    }

    async findAll(scopes?: any[]): Promise<ProjectColumn[]> {
        return await this.columnModel.scope(scopes).findAll();
    }

    async count(scopes?: any[]): Promise<number> {
        return await this.columnModel.scope(scopes).count();
    }

    async findById(
        id: number,
        scopes?: any[],
        transaction?: sequelize.Transaction,
    ): Promise<ProjectColumn> {
        return await this.columnModel
            .scope(scopes)
            .findByPk(id, { transaction });
    }
}
