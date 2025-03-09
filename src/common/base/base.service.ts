import { Model, Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';

export class BaseService<T extends Model> {
    protected readonly model: Repository<T>;

    constructor(model: Repository<T>) {
        this.model = model;
    }

    getList(scopes = [], transaction?: Transaction): Promise<T[]> {
        return this.model.scope(scopes).findAll({ transaction });
    }

    getCount(scopes = [], transaction?: Transaction): Promise<number> {
        return this.model.scope(scopes).count({ transaction });
    }

    getOne(scopes = [], transaction?: Transaction): Promise<T | null> {
        return this.model.scope(scopes).findOne({ transaction });
    }
}
