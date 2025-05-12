import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { SequelizeModule } from '../common/database/sequelize.module';
import { ConfigModule } from '../common/config/config.module';
import { jwtModuleInstance } from '../common/jwt/jwt.module';
import { redisModuleInstance } from '../common/database/redis.provider';
import { LoggerModule } from '../common/logger/logger.module';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/guards/guard.provider';
import { modelProviders } from './models.provider';

@Module({
    controllers: [AttachmentsController],
    imports: [
        SequelizeModule,
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        LoggerModule,
    ],
    providers: [
        AttachmentsService,
        UsersService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        ...modelProviders,
    ],
})
export class AttachmentsModule {}
