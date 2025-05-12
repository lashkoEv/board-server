import { User } from '../users/models';
import { Attachment } from './models/attachment.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'ATTACHMENT_MODEL',
        useValue: Attachment,
    },
];
