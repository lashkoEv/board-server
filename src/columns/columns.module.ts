import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { SequelizeModule } from '../common/database/sequelize.module';
import { ConfigModule } from '../common/config/config.module';
import { jwtModuleInstance } from '../common/jwt/jwt.module';
import { redisModuleInstance } from '../common/database/redis.provider';
import { LoggerModule } from '../common/logger/logger.module';
import { SessionsService } from '../sessions/sessions.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/guards/guard.provider';
import { ProjectsService } from '../projects/projects.service';
import { modelProviders } from './models.provider';

@Module({
    controllers: [ColumnsController],
    imports: [
        SequelizeModule,
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        LoggerModule,
    ],
    providers: [
        ColumnsService,
        ProjectsService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        ...modelProviders,
    ],
})
export class ColumnsModule {}
