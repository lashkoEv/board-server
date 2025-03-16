import { Module } from '@nestjs/common';
import { sequelizeProvider } from './sequelize.provider';
import { User } from '../../users/models';
import { Project, ProjectMember } from '../../projects/models';

@Module({
    providers: [sequelizeProvider([User, Project, ProjectMember])],
    exports: ['SEQUELIZE'],
})
export class SequelizeModule {}
