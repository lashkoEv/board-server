import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../resources/users';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
