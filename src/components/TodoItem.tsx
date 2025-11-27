import React, { useState } from 'react';
import { Todo } from '../db/db';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, updates: Partial<Todo>) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [editDueDate, setEditDueDate] = useState(
        todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
    );
    const [editNote, setEditNote] = useState(todo.note || '');

    // Format the date in Japanese style: YYYY/MM/DD HH:MM
    const formatDate = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    // Format date only: YYYY/MM/DD
    const formatDateOnly = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    // Linkify URLs in note text
    const linkifyNote = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline break-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const handleSave = () => {
        onUpdate(todo.id, {
            text: editText.trim(),
            dueDate: editDueDate ? new Date(editDueDate) : undefined,
            note: editNote.trim() || undefined,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
        setEditNote(todo.note || '');
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-slate-700/60 rounded-2xl p-6 shadow-xl border-2 border-cyan-500">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-4 py-3 text-base rounded-xl border-2 border-slate-600/50 bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="タスク名"
                    />

                    <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="w-full px-4 py-2 text-sm rounded-xl border-2 border-slate-600/50 bg-slate-900/60 text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />

                    <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 text-sm rounded-xl border-2 border-slate-600/50 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                        placeholder="メモ"
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={!editText.trim()}
                            className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            保存
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-slate-700/60 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-slate-700/80 transition-all cursor-pointer"
            onClick={(e) => {
                // Don't enter edit mode if clicking on checkbox, delete button, or links
                if ((e.target as HTMLElement).closest('input[type="checkbox"]') ||
                    (e.target as HTMLElement).closest('button') ||
                    (e.target as HTMLElement).closest('a')) {
                    return;
                }
                setIsEditing(true);
            }}
        >
            <div className="flex items-start gap-6">
                {/* Large checkbox */}
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggle(todo.id, e.target.checked);
                    }}
                    className="w-7 h-7 flex-shrink-0 accent-cyan-500 cursor-pointer rounded-lg mt-1"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Task content */}
                <div className="flex-1 min-w-0">
                    <p className={`text-lg font-medium mb-2 ${todo.completed
                        ? 'line-through text-slate-400'
                        : 'text-white'
                        }`}>
                        {todo.text}
                    </p>

                    <div className="space-y-1">
                        <div className="text-xs text-slate-500">登録日時：{formatDate(todo.createdAt)}</div>

                        {todo.dueDate && (
                            <div className={`text-xs font-medium ${(() => {
                                const now = new Date();
                                now.setHours(0, 0, 0, 0); // Normalize 'now' to start of day for accurate day diff
                                const due = new Date(todo.dueDate);
                                due.setHours(0, 0, 0, 0); // Normalize 'due' to start of day
                                const diffTime = due.getTime() - now.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                if (diffDays < 0 && !todo.completed) {
                                    return 'text-red-400'; // 期限切れ
                                } else if (diffDays >= 0 && diffDays <= 7 && !todo.completed) {
                                    return 'text-amber-400'; // 7日以内
                                } else {
                                    return 'text-slate-500'; // デフォルト
                                }
                            })()
                                }`}>
                                期限日：{formatDateOnly(todo.dueDate)}
                            </div>
                        )}

                        {todo.note && (
                            <div className="text-xs text-slate-400 mt-2 p-2 bg-slate-800/50 rounded-lg whitespace-pre-wrap break-words">
                                {linkifyNote(todo.note)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(todo.id);
                    }}
                    className="flex-shrink-0 p-3 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-600/50 transition-all cursor-pointer"
                    aria-label="Delete todo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
