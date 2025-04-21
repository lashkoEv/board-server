import { Project, ProjectMember } from '../projects/models';
import { ProjectColumn } from './models/column.entity';
import { User } from '../users/models';

export const modelProviders = [
    {
        provide: 'COLUMN_MODEL',
        useValue: ProjectColumn,
    },
    {
        provide: 'PROJECT_MODEL',
        useValue: Project,
    },
    {
        provide: 'PROJECT_MEMBER_MODEL',
        useValue: ProjectMember,
    },
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
];
