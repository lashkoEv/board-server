import { Project, ProjectMember } from './models';
import { User } from '../users/models';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'PROJECT_MODEL',
        useValue: Project,
    },
    {
        provide: 'PROJECT_MEMBER_MODEL',
        useValue: ProjectMember,
    },
];
