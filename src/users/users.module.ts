import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '../common/config/config.module';
import { LoggerModule } from '../common/logger/logger.module';
import { sequelizeProvider } from '../common/database/sequelize.provider';
import { User } from './models';
import { modelProviders } from './models.provider';
import { jwtModuleInstance } from '../common/jwt/jwt.module';
import { redisModuleInstance } from '../common/database/redis.provider';
import { SessionsService } from '../sessions/sessions.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { guardProviders } from '../common/guards/guard.provider';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        LoggerModule,
    ],
    providers: [
        UsersService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider([User]),
        ...modelProviders,
    ],
    controllers: [UsersController],
})
export class UsersModule {}
