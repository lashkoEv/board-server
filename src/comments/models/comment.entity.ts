import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Scopes,
} from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.entity';
import { User } from '../../users/models';

@Scopes(() => ({
    withAuthor: {
        include: [{ model: User, as: 'author' }],
    },
    byTaskId: (taskId: number) => ({
        where: { taskId },
    }),
    byPage: (limit: number = 10, offset: number = 0) => ({
        limit,
        offset,
    }),
}))
@Table({
    tableName: 'comments',
    timestamps: true,
})
export class Comment extends Model {
    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare content: string;

    @ForeignKey(() => Task)
    @Column({ type: DataType.INTEGER })
    declare taskId: number;

    @BelongsTo(() => Task)
    task: Task;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare authorId: number;

    @BelongsTo(() => User, 'authorId')
    author: User;
}
