import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
    imports: [ConfigModule, UsersModule, SessionsModule, ProjectsModule],
    controllers: [],
})
export class AppModule {}
