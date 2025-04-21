import { Inject, Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from '../common/base';
import { Task } from './models/task.entity';
import { CreateTaskDto } from './models/create-task.dto';
import { UpdateTaskDto } from './models/update-task.dto';

@Injectable()
export class TasksService extends BaseService<Task> {
    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        @Inject('TASK_MODEL')
        private readonly taskModel: Repository<Task>,
    ) {
        super(taskModel);
    }

    async create(data: CreateTaskDto, authorId: number): Promise<Task> {
        return await this.taskModel.create({
            title: data.title,
            description: data.description,
            estimate: data.estimate ?? 0,
            projectId: data.projectId,
            columnId: data.columnId,
            assigneeId: data.assigneeId,
            authorId,
        });
    }

    async update(task: Task, data: UpdateTaskDto): Promise<Task> {
        return await task.update({
            title: data.title ?? task.title,
            description: data.description ?? task.description,
            estimate: data.estimate ?? task.estimate,
            columnId: data.columnId ?? task.columnId,
            assigneeId: data.assigneeId ?? task.assigneeId,
        });
    }

    async findAll(scopes?: any[]): Promise<Task[]> {
        return await this.taskModel.scope(scopes).findAll();
    }

    async count(scopes?: any[]): Promise<number> {
        return await this.taskModel.scope(scopes).count();
    }

    async findById(id: number, scopes?: any[]): Promise<Task> {
        return await this.taskModel.scope(scopes).findByPk(id);
    }
}
