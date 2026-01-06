import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Flame, Trash2, Trophy } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import AddHabitModal from './AddHabitModal';

const HabitTracker = ({ isDarkMode }) => {
    const { habits, addHabit, toggleHabit, deleteHabit } = useHabits();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get last 7 days for the weekly view
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getLast7Days();
    const todayStr = new Date().toISOString().split('T')[0];

    const getDayLabel = (date) => {
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return days[date.getDay()];
    };

    // Calculate overall completion for today
    const todayCompletion = habits.length > 0
        ? Math.round((habits.filter(h => h.history[todayStr]).length / habits.length) * 100)
        : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-black text-surface-900 dark:text-white flex items-center gap-3">
                        Daily Rituals
                        <div className="px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-bold text-surface-500">
                            {todayCompletion}% Done
                        </div>
                    </h2>
                    <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mt-1">
                        Build consistency, one day at a time.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="premium-button p-3 rounded-xl flex items-center gap-2"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Habit</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {habits.map((habit) => (
                        <motion.div
                            key={habit.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className={`group relative p-5 rounded-2xl border transition-all ${habit.history[todayStr]
                                ? 'bg-brand-500/5 border-brand-500/20'
                                : 'bg-white dark:bg-surface-800 border-black/5 dark:border-white/5 hover:border-brand-500/30'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-display font-bold text-lg ${habit.history[todayStr] ? 'text-brand-600 dark:text-brand-400' : 'text-surface-900 dark:text-white'}`}>
                                            {habit.title}
                                        </h3>
                                        {habit.streak > 2 && (
                                            <div className="flex items-center text-xs font-black text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-md animate-pulse">
                                                <Flame size={10} className="mr-0.5 fill-current" />
                                                {habit.streak}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${habit.category === 'health' ? 'bg-emerald-500/10 text-emerald-600' :
                                            habit.category === 'learning' ? 'bg-blue-500/10 text-blue-600' :
                                                habit.category === 'mindfulness' ? 'bg-amber-500/10 text-amber-600' :
                                                    'bg-purple-500/10 text-purple-600'
                                        }`}>
                                        {habit.category}
                                    </span>
                                </div>

                                <button
                                    onClick={() => deleteHabit(habit.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Weekly Grid */}
                            <div className="flex justify-between items-center gap-2 mt-4">
                                {weekDays.map((date, i) => {
                                    const dStr = date.toISOString().split('T')[0];
                                    const isToday = dStr === todayStr;
                                    const isCompleted = habit.history[dStr];

                                    return (
                                        <div key={i} className="flex flex-col items-center gap-1.5">
                                            <span className={`text-[10px] font-bold ${isToday ? 'text-brand-500' : 'text-surface-400'}`}>
                                                {getDayLabel(date)}
                                            </span>
                                            <motion.button
                                                whileTap={{ scale: 0.8 }}
                                                onClick={() => toggleHabit(habit.id, dStr)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                                                        : 'bg-surface-100 dark:bg-surface-700 text-transparent hover:bg-surface-200 dark:hover:bg-surface-600'
                                                    }`}
                                            >
                                                <Check size={14} strokeWidth={4} />
                                            </motion.button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Today's Toggle (Large) */}
                            {!habit.history[todayStr] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6"
                                >
                                    <button
                                        onClick={() => toggleHabit(habit.id, todayStr)}
                                        className="w-full py-3 rounded-xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 font-bold text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Mark Complete
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}

                    {/* Add Button Card (if empty) */}
                    {habits.length === 0 && (
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center p-10 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-3xl opacity-60">
                            <Trophy size={48} className="text-surface-300 mb-4" />
                            <p className="text-surface-500 font-medium">No rituals established yet.</p>
                            <button onClick={() => setIsModalOpen(true)} className="text-brand-500 font-bold mt-2 hover:underline">Start your first streak</button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <AddHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addHabit}
            />
        </div>
    );
};

export default HabitTracker;
