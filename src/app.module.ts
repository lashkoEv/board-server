import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { ProjectsModule } from './projects/projects.module';
import { SequelizeModule } from './common/database/sequelize.module';

@Module({
    imports: [
        ConfigModule,
        SequelizeModule,
        UsersModule,
        SessionsModule,
        ProjectsModule,
    ],
    providers: [],
    controllers: [],
})
export class AppModule {}
