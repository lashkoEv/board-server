import { User } from '../users/models';
import { Task } from '../tasks/models/task.entity';
import { Comment } from './models/comment.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'COMMENT_MODEL',
        useValue: Comment,
    },
    {
        provide: 'TASK_MODEL',
        useValue: Task,
    },
];
