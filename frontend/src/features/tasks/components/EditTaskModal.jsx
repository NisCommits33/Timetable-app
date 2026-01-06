import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Clock, Calendar, MapPin, Tag, AlertCircle, FileText, Sparkles, Layout, MessageSquare, Hash } from 'lucide-react';

/**
 * EditTaskModal - A premium interface for recalibrating existing objectives
 */
const EditTaskModal = ({ isOpen, task, onClose, onSave, isDarkMode }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        day: '',
        category: 'personal',
        priority: 'medium',
        location: '',
        notes: '',
        tags: [],
    });

    const priorityOptions = [
        { value: "low", label: "Low Priority", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
        { value: "medium", label: "Medium Priority", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
        { value: "high", label: "High Priority", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", dot: "bg-rose-500" },
    ];

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                startTime: task.startTime || '',
                endTime: task.endTime || '',
                day: task.day || '',
                category: task.category || 'personal',
                priority: task.priority || 'medium',
                location: task.location || '',
                notes: task.notes || '',
                tags: task.tags || [],
            });
        }
    }, [task]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.startTime || !formData.endTime || !formData.day) return;
        onSave({ ...task, ...formData });
        onClose();
    };

    const InputField = ({ label, icon: Icon, children, className = "" }) => (
        <div className={`space-y-2 ${className}`}>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Icon size={12} className="text-brand-500" />
                {label}
            </label>
            {children}
        </div>
    );

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
                                    <Edit2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-black text-surface-900 dark:text-white">Recalibrate Objective</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Tuning parameters for: {task.title}</p>
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

                        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-8">
                            <div className="space-y-6">
                                <InputField label="Objective Title" icon={Sparkles}>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-800 border-2 border-transparent focus:border-brand-500/30 dark:focus:border-brand-500/30 text-lg font-display font-bold text-surface-900 dark:text-white placeholder-surface-300 dark:placeholder-surface-600 shadow-sm transition-all outline-none"
                                        placeholder="What's the main mission?"
                                        required
                                    />
                                </InputField>

                                <InputField label="Detailed Intelligence" icon={MessageSquare}>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={2}
                                        className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-800 border-2 border-transparent focus:border-brand-500/30 dark:focus:border-brand-500/30 text-sm font-medium text-surface-700 dark:text-surface-300 placeholder-surface-300 dark:placeholder-surface-600 shadow-sm transition-all outline-none resize-none"
                                        placeholder="Add context, goals, or notes..."
                                    />
                                </InputField>
                            </div>

                            <div className="h-px bg-black/[0.03] dark:bg-white/[0.05]" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <InputField label="Temporal Window" icon={Clock}>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) => handleChange('startTime', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                                                required
                                            />
                                            <input
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) => handleChange('endTime', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </InputField>

                                    <InputField label="Designated Day" icon={Calendar}>
                                        <select
                                            value={formData.day}
                                            onChange={(e) => handleChange('day', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
                                            required
                                        >
                                            <option value="">Select Day</option>
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </InputField>
                                </div>

                                <div className="space-y-6">
                                    <InputField label="Priority Tier" icon={AlertCircle}>
                                        <div className="flex gap-2">
                                            {priorityOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleChange('priority', opt.value)}
                                                    className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.priority === opt.value
                                                            ? `${opt.bg} ${opt.color} ${opt.border} shadow-lg`
                                                            : 'bg-surface-50 dark:bg-surface-800 text-surface-400 border-transparent hover:border-black/5 dark:hover:border-white/10'
                                                        }`}
                                                >
                                                    {opt.value}
                                                </button>
                                            ))}
                                        </div>
                                    </InputField>

                                    <InputField label="Deployment Zone" icon={MapPin}>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => handleChange('location', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder-surface-400"
                                            placeholder="Where will this occur?"
                                        />
                                    </InputField>
                                </div>
                            </div>

                            <div className="h-px bg-black/[0.03] dark:bg-white/[0.05]" />

                            <InputField label="Operational Notes" icon={FileText}>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    rows={3}
                                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-medium text-surface-700 dark:text-surface-300 placeholder-surface-300 dark:placeholder-surface-600 shadow-sm transition-all outline-none resize-none"
                                    placeholder="Any additional mission critical logs..."
                                />
                            </InputField>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-4 rounded-2xl bg-surface-100 dark:bg-surface-800 text-surface-400 font-black uppercase tracking-widest text-xs hover:bg-surface-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="premium-button px-10 py-4 shadow-xl shadow-brand-500/20"
                                >
                                    Apply Changes
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditTaskModal;
