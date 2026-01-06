import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Plus, Calendar, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ViewSwitcher from '../layouts/ViewSwitcher';
import WeekView from '../features/tasks/components/WeekView';
import DayView from '../features/tasks/components/DayView';
import ListView from '../features/tasks/components/ListView';

const SchedulePage = ({
    tasks,
    isDarkMode,
    selectedDay,
    setSelectedDay,
    handleDeleteTask,
    handleEditTask,
    openDetailModal,
    handleTaskMove,
    toggleTracking,
    addManualTime,
    resetTracking,
    quickToggleCompletion,
    openCompletionModal,
    setFocusTask,
    setShowFocusTimer,
    onAddTaskClick
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                <div>
                    <h2 className="text-3xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-3">
                        Schedule Control
                        <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Master Board</div>
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 font-medium flex items-center gap-2 mt-1.5">
                        <Calendar className="h-4 w-4 text-brand-500" />
                        Orchestrate your time with precision
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAddTaskClick}
                    className="premium-button flex items-center justify-center gap-2 py-3 px-6 shadow-premium"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-bold uppercase tracking-widest text-sm">Add New Task</span>
                </motion.button>
            </div>

            {/* Main Container */}
            <div className="glass-card p-2 sm:p-6 min-h-[600px] flex flex-col">
                {/* View Switcher Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/5 dark:border-white/5">
                    <ViewSwitcher isDarkMode={isDarkMode} />

                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400">
                        <Sparkles size={14} className="text-brand-500 animate-pulse" />
                        Smart Scheduling Active
                    </div>
                </div>

                {/* View Content */}
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<Navigate to="week" replace />} />
                        <Route
                            path="week"
                            element={
                                <WeekView
                                    tasks={tasks}
                                    onDayClick={setSelectedDay}
                                    selectedDay={selectedDay}
                                    onDeleteTask={handleDeleteTask}
                                    onEditTask={handleEditTask}
                                    onViewDetails={openDetailModal}
                                    onTaskMove={handleTaskMove}
                                    isDarkMode={isDarkMode}
                                    onToggleTracking={toggleTracking}
                                    onAddManualTime={addManualTime}
                                    onResetTracking={resetTracking}
                                    onToggleCompletion={quickToggleCompletion}
                                    onOpenCompletionModal={openCompletionModal}
                                    onStartFocus={(task) => {
                                        setFocusTask(task);
                                        setShowFocusTimer(true);
                                    }}
                                />
                            }
                        />
                        <Route
                            path="day"
                            element={
                                <DayView
                                    tasks={tasks}
                                    selectedDay={selectedDay}
                                    onTaskClick={openDetailModal}
                                    onEditTask={handleEditTask}
                                    onDeleteTask={handleDeleteTask}
                                    isDarkMode={isDarkMode}
                                    onToggleTracking={toggleTracking}
                                    onAddManualTime={addManualTime}
                                    onResetTracking={resetTracking}
                                    onToggleCompletion={quickToggleCompletion}
                                    onOpenCompletionModal={openCompletionModal}
                                    onStartFocus={(task) => {
                                        setFocusTask(task);
                                        setShowFocusTimer(true);
                                    }}
                                />
                            }
                        />
                        <Route
                            path="list"
                            element={
                                <ListView
                                    tasks={tasks}
                                    onTaskClick={openDetailModal}
                                    onEditTask={handleEditTask}
                                    onDeleteTask={handleDeleteTask}
                                    isDarkMode={isDarkMode}
                                    onToggleTracking={toggleTracking}
                                    onToggleCompletion={quickToggleCompletion}
                                    onOpenCompletionModal={openCompletionModal}
                                    onStartFocus={(task) => {
                                        setFocusTask(task);
                                        setShowFocusTimer(true);
                                    }}
                                />
                            }
                        />
                        <Route
                            path="board"
                            element={
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-24 text-surface-400"
                                >
                                    <div className="p-6 rounded-3xl bg-surface-100 dark:bg-surface-800 mb-6 border border-black/5 dark:border-white/5">
                                        <Plus className="h-12 w-12 opacity-20" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-2">Board View</h3>
                                    <p className="text-sm font-medium opacity-60">Coming soon in the next update.</p>
                                </motion.div>
                            }
                        />
                        <Route
                            path="timeline"
                            element={
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-24 text-surface-400"
                                >
                                    <div className="p-6 rounded-3xl bg-surface-100 dark:bg-surface-800 mb-6 border border-black/5 dark:border-white/5">
                                        <Clock className="h-12 w-12 opacity-20" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-2">Timeline View</h3>
                                    <p className="text-sm font-medium opacity-60">Coming soon in the next update.</p>
                                </motion.div>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </motion.div>
    );
};

export default SchedulePage;
