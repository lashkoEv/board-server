export enum ColumnStatus {
    toDo = 1,
    inProgress = 2,
    done = 3,
    custom = 4,
}

export const ColumnStatusTitle: Record<ColumnStatus, string> = {
    [ColumnStatus.toDo]: 'To Do',
    [ColumnStatus.inProgress]: 'In Progress',
    [ColumnStatus.done]: 'Done',
    [ColumnStatus.custom]: 'Custom',
};
