import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../common/base';
import { CreateUserDto, User } from './models';

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(@Inject('USER_MODEL') model: Repository<User>) {
        super(model);
    }

    getUserByEmail(email: string, scopes?: any[]): Promise<User | null> {
        return this.model.scope(scopes || []).findOne({
            where: {
                email,
            },
        });
    }

    create(body: CreateUserDto): Promise<User> {
        return this.model.create({ ...body });
    }

    getUser(
        userId: number,
        scopes?: any[],
        transaction?: Transaction,
    ): Promise<User | null> {
        return this.model.scope(scopes || []).findByPk(userId, { transaction });
    }
}
