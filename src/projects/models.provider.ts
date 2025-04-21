import { Project, ProjectMember } from './models';
import { User } from '../users/models';
import { ProjectColumn } from '../columns/models/column.entity';

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
    {
        provide: 'COLUMN_MODEL',
        useValue: ProjectColumn,
    },
];
