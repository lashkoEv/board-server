import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Scopes,
} from 'sequelize-typescript';
import { Project } from '../../projects/models';
import { User } from '../../users/models';
import { ProjectColumn } from '../../columns/models/column.entity';
import { Op } from 'sequelize';

@Scopes(() => ({
    withAuthor: {
        include: [{ model: User, as: 'author' }],
    },
    withAssignee: {
        include: [{ model: User, as: 'assignee' }],
    },
    withColumn: {
        include: [{ model: ProjectColumn, as: 'column' }],
    },
    byProjectId: (projectId: number) => ({
        where: { projectId },
    }),
    inBacklog: {
        where: {
            [Op.or]: [
                { columnId: null },
                {
                    '$column.status$': {
                        [Op.ne]: 3,
                    },
                },
            ],
        },
        include: [
            {
                model: ProjectColumn,
                as: 'column',
                attributes: ['id', 'title', 'status'],
                required: false,
            },
        ],
    },
}))
@Table({
    tableName: 'tasks',
    timestamps: true,
})
export class Task extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare estimate: number;

    @ForeignKey(() => Project)
    @Column({ type: DataType.INTEGER })
    declare projectId: number;

    @BelongsTo(() => Project)
    project: Project;

    @ForeignKey(() => ProjectColumn)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare columnId: number;

    @BelongsTo(() => ProjectColumn, 'columnId')
    column: ProjectColumn;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare authorId: number;

    @BelongsTo(() => User, 'authorId')
    author: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    declare assigneeId: number;

    @BelongsTo(() => User, 'assigneeId')
    assignee: User;
}
