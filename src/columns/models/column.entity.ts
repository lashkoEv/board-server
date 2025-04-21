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

@Scopes(() => ({
    withProject: {
        include: [{ model: Project, as: 'project' }],
    },
    byProjectId: (projectId: number) => ({
        where: { projectId },
    }),
    byTitle: (projectId: number) => ({
        where: { projectId },
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
        unique: true,
    })
    declare title: string;

    @ForeignKey(() => Project)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare projectId: number;

    @BelongsTo(() => Project)
    project: Project;
}
