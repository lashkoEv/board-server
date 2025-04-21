import { Module } from '@nestjs/common';
import { sequelizeProvider } from './sequelize.provider';
import { User } from '../../users/models';
import { Project, ProjectMember } from '../../projects/models';
import { ProjectColumn } from '../../columns/models/column.entity';
import { Task } from '../../tasks/models/task.entity';

@Module({
    providers: [
        sequelizeProvider([User, Project, ProjectMember, ProjectColumn, Task]),
    ],
    exports: ['SEQUELIZE'],
})
export class SequelizeModule {}
