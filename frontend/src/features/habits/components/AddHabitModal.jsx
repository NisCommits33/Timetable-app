import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Tag, Target } from 'lucide-react';

const AddHabitModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('health');
    const [goal, setGoal] = useState(1);

    const categories = [
        { id: 'health', label: 'Health', color: 'bg-emerald-500' },
        { id: 'learning', label: 'Learning', color: 'bg-blue-500' },
        { id: 'productivity', label: 'Productivity', color: 'bg-purple-500' },
        { id: 'mindfulness', label: 'Mindfulness', color: 'bg-amber-500' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({ title, category, goal });
        setTitle('');
        setCategory('health');
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                >
                    <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-gradient-to-br from-brand-500/[0.05] to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                                <Sparkles size={20} />
                            </div>
                            <h2 className="text-xl font-display font-black text-surface-900 dark:text-white">New Ritual</h2>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <X size={20} className="text-surface-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Habit Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-black/5 dark:border-white/5 text-surface-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder-surface-400"
                                placeholder="e.g., Morning Meditation"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Category</label>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${category === cat.id
                                            ? 'bg-surface-100 dark:bg-surface-800 border-brand-500 ring-1 ring-brand-500/20'
                                            : 'bg-transparent border-black/5 dark:border-white/5 hover:bg-surface-50 dark:hover:bg-surface-800'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                                        <span className={`text-sm font-bold ${category === cat.id ? 'text-surface-900 dark:text-white' : 'text-surface-500'}`}>
                                            {cat.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="premium-button py-3 px-8 flex items-center gap-2 shadow-xl shadow-brand-500/20"
                            >
                                <Plus size={18} />
                                <span>Create Habit</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default AddHabitModal;
