import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '../common/database/sequelize.module';
import { ConfigModule } from '../common/config/config.module';
import { jwtModuleInstance } from '../common/jwt/jwt.module';
import { redisModuleInstance } from '../common/database/redis.provider';
import { LoggerModule } from '../common/logger/logger.module';
import { SessionsService } from '../sessions/sessions.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/guards/guard.provider';
import { modelProviders } from './models.provider';
import { TasksService } from '../tasks/tasks.service';

@Module({
    controllers: [CommentsController],
    imports: [
        SequelizeModule,
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        LoggerModule,
    ],
    providers: [
        CommentsService,
        TasksService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        ...modelProviders,
    ],
})
export class CommentsModule {}
