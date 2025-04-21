import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SequelizeModule } from '../common/database/sequelize.module';
import { ConfigModule } from '../common/config/config.module';
import { jwtModuleInstance } from '../common/jwt/jwt.module';
import { redisModuleInstance } from '../common/database/redis.provider';
import { LoggerModule } from '../common/logger/logger.module';
import { ColumnsService } from '../columns/columns.service';
import { ProjectsService } from '../projects/projects.service';
import { SessionsService } from '../sessions/sessions.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/guards/guard.provider';
import { UsersService } from '../users/users.service';
import { modelProviders } from './models.provider';

@Module({
    controllers: [TasksController],
    imports: [
        SequelizeModule,
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        LoggerModule,
    ],
    providers: [
        TasksService,
        ProjectsService,
        ColumnsService,
        UsersService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        ...modelProviders,
    ],
})
export class TasksModule {}
