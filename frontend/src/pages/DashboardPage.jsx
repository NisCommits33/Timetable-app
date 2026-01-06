import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3, TrendingUp } from 'lucide-react';
import AnalyticsDashboard from '../features/analytics/components/AnalyticsDashboard';

const DashboardPage = ({ tasks, isDarkMode, onAddTaskClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-12"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm tracking-wider uppercase">
                        <BarChart3 className="h-4 w-4" />
                        Performance Overview
                    </div>
                    <h2 className="text-4xl font-display font-bold tracking-tight text-surface-900 dark:text-white">
                        Dashboard
                    </h2>
                    <p className="text-surface-600 dark:text-surface-400 max-w-2xl text-lg">
                        Real-time insights into your productivity and task performance.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAddTaskClick}
                    className="premium-button flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 min-w-[140px]"
                >
                    <Plus className="h-5 w-5" />
                    <span>New Task</span>
                </motion.button>
            </div>

            <div className="glass-card overflow-hidden">
                <AnalyticsDashboard
                    tasks={tasks}
                    isDarkMode={isDarkMode}
                />
            </div>
        </motion.div>
    );
};

export default DashboardPage;
