import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Scopes,
    HasMany,
} from 'sequelize-typescript';
import { Project } from '../../projects/models';
import { Task } from '../../tasks/models/task.entity';
import { ColumnStatus } from '../../common/resources/columns';
import { User } from '../../users/models';
import { Op } from 'sequelize';

@Scopes(() => ({
    withProject: {
        include: [{ model: Project, as: 'project' }],
    },
    byProjectId: (projectId: number) => ({
        where: { projectId },
    }),
    withTasks: {
        include: [
            {
                model: Task,
                as: 'tasks',
                include: [
                    {
                        model: User,
                        as: 'assignee',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            },
        ],
    },
    withFilteredTasks: (taskQuery?: string, assigneeId?: number[]) => ({
        include: [
            {
                model: Task,
                as: 'tasks',
                where: {
                    ...(taskQuery && {
                        title: { [Op.like]: `%${taskQuery}%` },
                    }),
                    ...(Array.isArray(assigneeId) &&
                        assigneeId.length > 0 && {
                            assigneeId: {
                                [Op.or]: [
                                    {
                                        [Op.in]: assigneeId.filter(
                                            (v) => v !== null,
                                        ),
                                    },
                                    ...(assigneeId.includes(null)
                                        ? [{ [Op.is]: null }]
                                        : []),
                                ],
                            },
                        }),
                },
                required: false,
                include: [
                    {
                        model: User,
                        as: 'assignee',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            },
        ],
    }),
}))
@Table({
    tableName: 'columns',
    timestamps: true,
})
export class ProjectColumn extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @ForeignKey(() => Project)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare projectId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: ColumnStatus.custom,
    })
    declare status: number;

    @BelongsTo(() => Project)
    project: Project;

    @HasMany(() => Task, { foreignKey: 'columnId', as: 'tasks' })
    tasks: Task[];
}
