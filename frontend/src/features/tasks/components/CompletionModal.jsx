import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  X,
  Clock,
  Star,
  MessageSquare,
  Calendar,
  Flag,
  Zap,
  Sparkles,
  Trophy,
  Target,
  ChevronRight
} from 'lucide-react';

/**
 * CompletionModal - A premium "Mission Debrief" experience
 */
const CompletionModal = ({ isOpen, onClose, task, onComplete, isDarkMode }) => {
  const [remarks, setRemarks] = useState('');
  const [completionType, setCompletionType] = useState('completed');
  const [timeSpent, setTimeSpent] = useState('');
  const [rating, setRating] = useState(0);
  const [customRemarks, setCustomRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRemarks('');
      setCompletionType('completed');
      setTimeSpent('');
      setRating(0);
      setCustomRemarks('');
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const completionTypes = [
    { id: 'completed', label: 'Victory', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: 'Objective achieved fully' },
    { id: 'partially', label: 'Tactical Gain', icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', desc: 'Significant progress made' },
    { id: 'deferred', label: 'Strategic Pivot', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', desc: 'Rescheduled for later' },
    { id: 'cancelled', label: 'Mission Abort', icon: X, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', desc: 'No longer a priority' }
  ];

  const quickRemarks = [
    'Ahead of schedule ⚡',
    'Deep focus achieved 🧠',
    'Tactical victory 🎯',
    'Strategic pivot required 🔄'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const completionData = {
      completed: completionType === 'completed' || completionType === 'partially',
      completionType,
      remarks: remarks || customRemarks,
      completedAt: new Date().toISOString(),
      timeSpent: timeSpent ? parseInt(timeSpent) : null,
      satisfaction: rating,
      actualDuration: timeSpent ? parseInt(timeSpent) * 60 : task.actualDuration
    };
    onComplete(task.id, completionData);
    onClose();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-xl glass-card overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-black/5 dark:border-white/5 bg-gradient-to-b from-emerald-500/[0.05] to-transparent">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black text-surface-900 dark:text-white">Mission Debrief</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Archiving Objective: {task.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400 hover:text-rose-500 transition-all border border-black/5 dark:border-white/5">
                <X size={18} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Completion Type Grid */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Target size={12} className="text-brand-500" />
                Objective Outcome
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completionTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setCompletionType(type.id)}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-4 ${completionType === type.id
                        ? `${type.bg} ${type.border} shadow-lg shadow-emerald-500/5`
                        : 'bg-surface-50 dark:bg-surface-800 text-surface-500 border-transparent hover:border-black/5 dark:hover:border-white/10'
                      }`}
                  >
                    <div className={`p-2 rounded-xl ${completionType === type.id ? 'bg-white dark:bg-surface-700' : 'bg-surface-100 dark:bg-surface-700'} ${type.color}`}>
                      <type.icon size={18} />
                    </div>
                    <div>
                      <div className={`text-sm font-black uppercase tracking-widest ${completionType === type.id ? type.color : 'text-surface-400'}`}>
                        {type.label}
                      </div>
                      <div className="text-[10px] font-medium opacity-60 leading-tight mt-0.5">{type.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Time Tracking Info */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                  <Zap size={12} className="text-amber-500" />
                  Time Intelligence
                </label>
                <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-800/30 border border-black/5 dark:border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-surface-400">Tracked</span>
                    <span className="text-sm font-display font-black text-brand-500 tabular-nums">
                      {formatDuration(task.timeTracking?.totalTimeSpent / 1000)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-surface-400 ml-1">Manual Override (min)</span>
                    <input
                      type="number"
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(e.target.value)}
                      placeholder={`Est: ${Math.round(task.estimatedDuration / 60)}`}
                      className="w-full px-4 py-2 bg-white dark:bg-surface-800 rounded-xl border border-black/5 dark:border-white/5 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Satisfaction */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                  <Sparkles size={12} className="text-purple-500" />
                  Fulfillment Level
                </label>
                <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-800/30 border border-black/5 dark:border-white/5 flex items-center justify-center gap-2 h-full">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-2 rounded-xl transition-all ${rating >= s ? 'text-amber-500 scale-110' : 'text-surface-300 dark:text-surface-600 hover:text-amber-500/50'}`}
                    >
                      <Star size={24} fill={rating >= s ? 'currentColor' : 'none'} className="stroke-[2.5]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <MessageSquare size={12} className="text-brand-500" />
                Mission Logs
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickRemarks.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRemarks(r); setCustomRemarks(''); }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${remarks === r ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-surface-50 dark:bg-surface-800 text-surface-400 border border-black/5 dark:border-white/5'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <textarea
                value={customRemarks}
                onChange={(e) => { setCustomRemarks(e.target.value); setRemarks(''); }}
                placeholder="Enter custom debrief data..."
                rows={3}
                className="w-full px-5 py-4 rounded-3xl bg-surface-50/50 dark:bg-surface-800/30 border border-black/5 dark:border-white/5 text-sm font-medium text-surface-600 dark:text-surface-300 outline-none focus:border-brand-500/30 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="premium-button w-full sm:w-auto px-12 py-5 shadow-2xl shadow-emerald-500/20"
              >
                <CheckCircle2 size={20} className="mr-3" />
                <span className="font-display font-black uppercase tracking-widest">Finalize Debrief</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompletionModal;