import { ProjectColumn } from '../columns/models/column.entity';
import { Project, ProjectMember } from '../projects/models';
import { User } from '../users/models';
import { Task } from './models/task.entity';
import { Attachment } from '../attachments/models/attachment.entity';
import { Comment } from '../comments/models/comment.entity';

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
    {
        provide: 'TASK_MODEL',
        useValue: Task,
    },
    {
        provide: 'ATTACHMENT_MODEL',
        useValue: Attachment,
    },
    {
        provide: 'COMMENT_MODEL',
        useValue: Comment,
    },
];
