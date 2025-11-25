import Dexie, { type EntityTable } from 'dexie';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
    dueDate?: Date;  // Optional due date
    note?: string;   // Optional note
}

const db = new Dexie('TodoDatabase') as Dexie & {
    todos: EntityTable<
        Todo,
        'id' // primary key "id" (for the typings only)
    >;
};

// Schema declaration:
db.version(3).stores({
    todos: '++id, text, completed, createdAt, dueDate, note' // primary key "id" (for the runtime!)
});

export type { Todo };
export { db };
