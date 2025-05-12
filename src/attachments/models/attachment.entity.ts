import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Task } from '../../tasks/models/task.entity';

@Table({
    tableName: 'taskAttachments',
    timestamps: true,
})
export class Attachment extends Model {
    @ForeignKey(() => Task)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare taskId: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare storedName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare originalName: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare mimeType: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    declare size: number;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare url: string;

    @BelongsTo(() => Task)
    task: Task;
}
