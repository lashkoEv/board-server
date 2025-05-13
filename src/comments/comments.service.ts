import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Comment } from './models/comment.entity';
import { CreateCommentDto } from './models/create-comment.dto';
import { UpdateCommentDto } from './models/update-comment.dto';
import { Task } from '../tasks/models/task.entity';

@Injectable()
export class CommentsService {
    constructor(
        @Inject('COMMENT_MODEL')
        private readonly commentModel: Repository<Comment>,
        @Inject('TASK_MODEL') private readonly taskModel: Repository<Task>,
    ) {}

    async create(dto: CreateCommentDto, authorId: number): Promise<Comment> {
        const task = await this.taskModel.findByPk(dto.taskId);

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return this.commentModel.create({
            content: dto.content,
            taskId: dto.taskId,
            authorId,
        });
    }

    async update(comment: Comment, dto: UpdateCommentDto): Promise<Comment> {
        return comment.update({ content: dto.content });
    }

    async delete(comment: Comment): Promise<void> {
        await comment.destroy();
    }

    async findById(id: number, scopes?: any[]): Promise<Comment | null> {
        return this.commentModel.scope(scopes).findByPk(id);
    }

    async findAll(scopes?: any[]): Promise<Comment[]> {
        return this.commentModel.scope(scopes).findAll();
    }

    async count(scopes?: any[]): Promise<number> {
        return await this.commentModel.scope(scopes).count();
    }
}
