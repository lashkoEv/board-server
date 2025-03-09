import { User } from '../users/models';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
];
