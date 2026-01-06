import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import HabitTracker from '../features/habits/components/HabitTracker';

const HabitsPage = ({ isDarkMode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-12"
        >
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold text-sm tracking-wider uppercase">
                    <Flame className="h-4 w-4" />
                    Consistency Builder
                </div>
                <h2 className="text-4xl font-display font-bold tracking-tight text-surface-900 dark:text-white">
                    Habit Tracker
                </h2>
                <p className="text-surface-600 dark:text-surface-400 max-w-2xl text-lg">
                    Track your daily rituals and build long-lasting streaks.
                </p>
            </div>

            <div className="glass-card p-6 min-h-[60vh]">
                <HabitTracker isDarkMode={isDarkMode} />
            </div>
        </motion.div>
    );
};

export default HabitsPage;
