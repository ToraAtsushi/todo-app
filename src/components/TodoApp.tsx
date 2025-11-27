'use client';

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Todo } from '../db/db';
import { AddTodo } from './AddTodo';
import { TodoList } from './TodoList';

export const TodoApp: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const todos = useLiveQuery(async () => {
        let collection = db.todos.toCollection();

        if (filter === 'active') {
            collection = db.todos.filter(t => !t.completed);
        } else if (filter === 'completed') {
            collection = db.todos.filter(t => t.completed);
        }

        const allTodos = await collection.toArray();

        // カスタムソート
        return allTodos.sort((a, b) => {
            // 1. 完了済みは最後
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;

            // 2. 未完了の場合、期限日の有無で並び替え
            if (!a.completed && !b.completed) {
                // 期限日ありが優先
                if (a.dueDate && !b.dueDate) return -1;
                if (!a.dueDate && b.dueDate) return 1;

                // 両方期限日ありの場合、期限日が近い順
                if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                }
            }

            // 3. その他は登録日時の新しい順
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [filter]);

    const handleAddTodo = async (text: string, dueDate?: Date, note?: string) => {
        try {
            await db.todos.add({
                text,
                completed: false,
                createdAt: new Date(),
                dueDate,
                note,
            });
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const handleToggleTodo = async (id: number, completed: boolean) => {
        try {
            await db.todos.update(id, { completed });
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        try {
            await db.todos.delete(id);
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const handleUpdateTodo = async (id: number, updates: Partial<Todo>) => {
        try {
            await db.todos.update(id, updates);
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    if (!todos) return null;

    return (
        <div className="min-h-screen bg-slate-900" style={{ backgroundColor: '#0d223a' }}>
            <div className="mx-auto py-6 px-4 md:py-12 md:px-6 lg:py-16 lg:px-8 max-w-7xl">
                {/* Header Area - Grouped */}
                <div className="bg-slate-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 mb-6 md:mb-8 lg:mb-10 shadow-2xl backdrop-blur-sm">
                    <div className="text-center mb-4 md:mb-6 lg:mb-8">
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-cyan-400">
                            TODOリスト
                        </h1>
                    </div>

                    {/* Filter Buttons - Larger and more prominent */}
                    <div className="flex justify-center gap-2 md:gap-3 lg:gap-4">
                        {(['all', 'active', 'completed'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-xl md:rounded-2xl text-sm md:text-base font-bold transition-all shadow-lg hover:scale-105 cursor-pointer ${filter === f
                                    ? 'bg-cyan-500 text-white shadow-cyan-500/50'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {/* Sidebar - Grouped dark area */}
                    <div className="lg:col-span-1 space-y-4 md:space-y-6 lg:space-y-8">
                        {/* Add Task Area */}
                        <div className="bg-slate-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl backdrop-blur-sm">
                            <h2 className="text-xs md:text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 md:mb-6">Add New Task</h2>
                            <AddTodo onAdd={handleAddTodo} />
                        </div>

                        {/* Status Area */}
                        <div className="bg-slate-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl backdrop-blur-sm">
                            <h2 className="text-xs md:text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 md:mb-6">Status</h2>
                            <div className="space-y-3 md:space-y-4 lg:space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 text-sm md:text-base font-medium">Total</span>
                                    <span className="font-mono text-xl md:text-2xl lg:text-3xl text-white font-bold">{todos.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 text-sm md:text-base font-medium">Active</span>
                                    <span className="font-mono text-xl md:text-2xl lg:text-3xl text-cyan-400 font-bold">{todos.filter(t => !t.completed).length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 text-sm md:text-base font-medium">Completed</span>
                                    <span className="font-mono text-xl md:text-2xl lg:text-3xl text-emerald-400 font-bold">{todos.filter(t => t.completed).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Area */}
                    <div className="lg:col-span-2">
                        {/* <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-white">TODO一覧</h2>
                        </div> */}
                        <TodoList
                            todos={todos}
                            onToggle={handleToggleTodo}
                            onDelete={handleDeleteTodo}
                            onUpdate={handleUpdateTodo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
