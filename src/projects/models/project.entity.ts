import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
    Scopes,
} from 'sequelize-typescript';
import { User } from '../../users/models';
import { ProjectMember } from './project-member.entity';
import { Op } from 'sequelize';

@Scopes(() => ({
    withOwner: {
        include: [{ model: User, as: 'owner' }],
    },
    withMembers: {
        include: [{ model: User, through: { attributes: [] }, as: 'members' }],
    },
    byPage: (limit: number = 10, offset: number = 0) => ({
        limit,
        offset,
    }),
    byOwnerId: (ownerId: number) => ({
        where: { ownerId },
    }),
    byMemberId: (memberId: number) => ({
        include: [
            {
                model: User,
                through: { attributes: [] },
                as: 'members',
                where: { id: memberId },
            },
        ],
    }),
    byOwnerOrMemberId: (userId: number) => ({
        where: {
            [Op.or]: [{ ownerId: userId }, { '$members.id$': userId }],
        },
        include: [
            {
                model: User,
                through: { attributes: [] },
                as: 'members',
            },
        ],
    }),
}))
@Table({
    tableName: 'projects',
    timestamps: true,
})
export class Project extends Model {
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare ownerId: number;

    @BelongsTo(() => User)
    owner: User;

    @BelongsToMany(() => User, () => ProjectMember)
    members: User[];
}
