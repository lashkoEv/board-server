import { Module } from '@nestjs/common';
import { sequelizeProvider } from './sequelize.provider';
import { User } from '../../users/models';
import { Project, ProjectMember } from '../../projects/models';
import { ProjectColumn } from '../../columns/models/column.entity';

@Module({
    providers: [
        sequelizeProvider([User, Project, ProjectMember, ProjectColumn]),
    ],
    exports: ['SEQUELIZE'],
})
export class SequelizeModule {}
