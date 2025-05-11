import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Scopes,
    Sequelize,
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
    byPage: (limit: number = 10, offset: number = 0) => ({
        limit,
        offset,
    }),
    byQuery: (query: string) => ({
        where: {
            title: { [Op.like]: `%${query}%` },
        },
    }),
    inBacklog: {
        where: {
            [Op.or]: [
                { columnId: null },
                {
                    columnId: {
                        [Op.in]: Sequelize.literal(`(
                        SELECT id FROM columns
                        WHERE columns.status != 3
                    )`),
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
    byAssigneeIds: (ids: (number | null)[]) => ({
        where: {
            assigneeId: {
                [Op.or]: [
                    { [Op.in]: ids.filter((id) => id !== null) },
                    ...(ids.includes(null) ? [{ [Op.is]: null }] : []),
                ],
            },
        },
    }),

    byColumnIds: (ids: (number | null)[]) => ({
        where: {
            columnId: {
                [Op.or]: [
                    { [Op.in]: ids.filter((id) => id !== null) },
                    ...(ids.includes(null) ? [{ [Op.is]: null }] : []),
                ],
            },
        },
    }),
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
