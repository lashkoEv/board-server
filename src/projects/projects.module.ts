import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ConfigModule } from '../common/config/config.module';
import { jwtModuleInstance } from '../common/jwt/jwt.module';
import { redisModuleInstance } from '../common/database/redis.provider';
import { LoggerModule } from '../common/logger/logger.module';
import { SessionsService } from '../sessions/sessions.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/guards/guard.provider';
import { modelProviders } from './models.provider';
import { SequelizeModule } from '../common/database/sequelize.module';

@Module({
    controllers: [ProjectsController],
    imports: [
        SequelizeModule,
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        LoggerModule,
    ],
    providers: [
        ProjectsService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        ...modelProviders,
    ],
})
export class ProjectsModule {}
