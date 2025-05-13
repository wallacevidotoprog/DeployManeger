export const CREATE = 'create' as const;
export const UPDATE = 'update' as const;

export type ActionType = typeof CREATE | typeof UPDATE;