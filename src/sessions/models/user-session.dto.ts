import { UserRoles } from '../../common/resources/users';

export class UserSessionDto {
    constructor(data: any) {
        this.userId = data.userId;
        this.role = data.role;
        this.sessionId = data.sessionId;
    }

    readonly userId: number;
    readonly role: UserRoles;
    readonly sessionId: string;
}
