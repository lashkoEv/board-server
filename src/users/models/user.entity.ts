import {
    Table,
    Column,
    Model,
    Scopes,
    DataType,
    BeforeCreate,
    BeforeUpdate,
} from 'sequelize-typescript';
import { UserRoles } from '../../common/resources/users';
import { PasswordHelper } from '../../common/helpers/password.helper';

@Scopes(() => ({
    byRoles: (role: number) => ({
        where: { role },
    }),
}))
@Table({
    tableName: 'users',
    timestamps: true,
    underscored: false,
})
export class User extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare username: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: UserRoles.user,
    })
    declare role: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare salt: string;

    @BeforeCreate
    static hashPasswordBeforeCreate(model) {
        if (model.password) {
            model.salt = PasswordHelper.generateSalt();
            model.password = PasswordHelper.hash(model.password + model.salt);
        }
    }

    @BeforeUpdate
    static hashPasswordBeforeUpdate(model) {
        if (model.password && model.changed('password')) {
            model.salt = PasswordHelper.generateSalt();
            model.password = PasswordHelper.hash(model.password + model.salt);
        }
    }
}
