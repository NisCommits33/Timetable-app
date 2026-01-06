import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import AddTaskForm from './AddTaskForm';

const AddTaskModal = ({ isOpen, onClose, onAddTask, isDarkMode }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl glass-card overflow-hidden shadow-2xl border-brand-500/20"
                    >
                        {/* Header Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500" />

                        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-brand-500/[0.03] to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-black text-surface-900 dark:text-white">Forge New Task</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Initialize a fresh objective</p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-black/5 dark:border-white/5"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <AddTaskForm
                                onAddTask={(task) => {
                                    onAddTask(task);
                                    onClose();
                                }}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddTaskModal;
