import React, { useState } from 'react';

interface AddTodoProps {
    onAdd: (text: string, dueDate?: Date, note?: string) => void;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(
                text.trim(),
                dueDate ? new Date(dueDate) : undefined,
                note.trim() || undefined
            );
            setText('');
            setDueDate('');
            setNote('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-3 md:space-y-4">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="タスク名"
                className="w-full px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 text-sm md:text-base rounded-xl md:rounded-2xl border-2 border-slate-600/50 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />

            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-2 md:px-4 md:py-2 lg:px-5 lg:py-3 text-xs md:text-sm rounded-xl md:rounded-2xl border-2 border-slate-600/50 bg-slate-900/60 text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                placeholder="期限日（任意）"
            />

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="メモ（任意）"
                rows={3}
                className="w-full px-3 py-2 md:px-4 md:py-2 lg:px-5 lg:py-3 text-xs md:text-sm rounded-xl md:rounded-2xl border-2 border-slate-600/50 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none"
            />

            <button
                type="submit"
                disabled={!text.trim()}
                className="w-full px-4 py-3 md:px-5 md:py-3 lg:px-6 lg:py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm md:text-base font-bold rounded-xl md:rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                Add Task
            </button>
        </form>
    );
};
