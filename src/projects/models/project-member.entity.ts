import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/models';
import { Project } from './project.entity';

@Table({
    tableName: 'projectMembers',
    timestamps: true,
})
export class ProjectMember extends Model {
    @ForeignKey(() => User)
    @Column
    declare memberId: number;

    @ForeignKey(() => Project)
    @Column
    declare projectId: number;
}
