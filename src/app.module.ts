import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { ProjectsModule } from './projects/projects.module';
import { SequelizeModule } from './common/database/sequelize.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { CommentsModule } from './comments/comments.module';

@Module({
    imports: [
        ConfigModule,
        SequelizeModule,
        UsersModule,
        SessionsModule,
        ProjectsModule,
        ColumnsModule,
        TasksModule,
        AttachmentsModule,
        CommentsModule,
    ],
    providers: [],
    controllers: [],
})
export class AppModule {}
