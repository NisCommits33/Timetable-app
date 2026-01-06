import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Tag, Calendar, AlertCircle, Edit2, Trash2, FileText, Sparkles, Hash } from 'lucide-react';

/**
 * TaskDetailModal - A premium information sanctuary for task details
 */
function TaskDetailModal({ open, task, onClose, onEdit, onDelete, isDarkMode }) {
  if (!open || !task) return null;

  const priorityConfig = {
    high: { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'High Priority', icon: AlertCircle },
    medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Medium Priority', icon: Clock },
    low: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Low Priority', icon: Tag }
  };

  const config = priorityConfig[task.priority] || priorityConfig.medium;

  const DetailItem = ({ icon: Icon, label, value, colorClass = "text-surface-500 dark:text-surface-400" }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-800/30 border border-black/5 dark:border-white/5 group hover:border-brand-500/20 transition-all">
      <div className={`p-2.5 rounded-xl bg-white dark:bg-surface-700 shadow-sm transition-colors group-hover:text-brand-500`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-0.5">{label}</div>
        <div className={`text-sm font-bold ${colorClass}`}>{value}</div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-xl glass-card overflow-hidden shadow-2xl"
        >
          {/* Header Gradient & Accent */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.color === 'text-rose-500' ? 'from-rose-500 to-orange-500' : config.color === 'text-amber-500' ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500'}`} />

          <div className="p-8 border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-brand-500/[0.03] to-transparent">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                    {config.label}
                  </div>
                  <div className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border bg-brand-500/10 text-brand-500 border-brand-500/20">
                    {task.category || 'Mission'}
                  </div>
                </div>
                <h2 className="text-3xl font-display font-black text-surface-900 dark:text-white leading-tight">
                  {task.title}
                </h2>
              </div>

              <button onClick={onClose} className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400 hover:text-rose-500 transition-all border border-black/5 dark:border-white/5">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Mission Intel */}
            {task.description && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                  <FileText size={12} className="text-brand-500" />
                  Intelligence
                </div>
                <p className="text-sm font-medium text-surface-600 dark:text-surface-300 leading-relaxed bg-surface-50/50 dark:bg-surface-800/30 p-5 rounded-3xl border border-black/5 dark:border-white/5">
                  {task.description}
                </p>
              </div>
            )}

            {/* Core Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem icon={Calendar} label="Timeline" value={`${task.day} • ${task.startTime} - ${task.endTime}`} />
              <DetailItem icon={MapPin} label="Deployment Location" value={task.location || 'Co-working Node'} />
            </div>

            {/* Tags section */}
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                  <Hash size={12} className="text-brand-500" />
                  Classifications
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-500/10 rounded-xl border border-brand-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Field Notes */}
            {task.notes && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                  <Sparkles size={12} className="text-brand-500" />
                  Deployment Notes
                </div>
                <div className="p-5 rounded-3xl bg-surface-50/50 dark:bg-surface-800/30 border border-black/5 dark:border-white/5 italic text-sm text-surface-500 dark:text-surface-400">
                  {task.notes}
                </div>
              </div>
            )}
          </div>

          {/* Action Hub */}
          <div className="p-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row gap-4 bg-surface-50/30 dark:bg-surface-900/30">
            <div className="flex-1 flex gap-3">
              <button
                onClick={() => onEdit(task)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20"
              >
                <Edit2 size={16} />
                Modify Objective
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-rose-500/20"
              >
                <Trash2 size={16} />
                Abort Mission
              </button>
            </div>
            <button
              onClick={onClose}
              className="py-3.5 px-8 rounded-2xl bg-surface-200 dark:bg-surface-800 text-surface-600 dark:text-surface-300 font-black uppercase tracking-widest text-[10px] hover:bg-surface-300 transition-all border border-black/5 dark:border-white/5"
            >
              Stand Down
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default TaskDetailModal;