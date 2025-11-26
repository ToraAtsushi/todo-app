import React from 'react';
import { Todo } from '../db/db';
import { TodoItem } from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, updates: Partial<Todo>) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onUpdate }) => {
    if (todos.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <p className="text-lg">タスクは全て対応済みです！✅</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
};
