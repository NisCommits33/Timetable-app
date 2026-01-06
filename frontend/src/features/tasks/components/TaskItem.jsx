import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  Tag,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Play,
  Square,
  Circle,
  CheckCircle2,
  MessageCircle,
  Target,
  MoreVertical,
  GripVertical,
  X
} from "lucide-react";
import { formatTimeShort } from "../../timer/hooks/useTimeTracking";

const TaskItem = ({
  task,
  onDelete,
  onEdit,
  onViewDetails,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
  onToggleCompletion,
  onOpenCompletionModal,
  onStartFocus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTimerSection, setShowTimerSection] = useState(false);
  const [manualTimeInput, setManualTimeInput] = useState("15");
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    let interval;
    if (task.timeTracking?.isTracking) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task.timeTracking?.isTracking]);

  const getCurrentTimeSpent = () => {
    if (task.timeTracking?.isTracking) {
      const currentSessionTime = currentTime - task.timeTracking.currentSessionStart;
      return (task.timeTracking.totalTimeSpent || 0) + currentSessionTime;
    }
    return task.timeTracking?.totalTimeSpent || 0;
  };

  const currentTimeSpent = getCurrentTimeSpent();
  const progressPercent = task.estimatedDuration > 0
    ? Math.min(100, (currentTimeSpent / 1000 / task.estimatedDuration) * 100)
    : 0;

  const priorityConfig = {
    high: {
      color: 'red',
      gradient: 'from-rose-500 to-red-600',
      bg: 'bg-rose-500/5 dark:bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'shadow-rose-500/20'
    },
    medium: {
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/5 dark:bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/20'
    },
    low: {
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/20'
    }
  };

  const config = priorityConfig[task.priority] || priorityConfig.medium;

  const handleCompletionToggle = (e) => {
    e.stopPropagation();
    if (task.completed) {
      onToggleCompletion?.(task.id);
    } else {
      onOpenCompletionModal ? onOpenCompletionModal(task) : onToggleCompletion?.(task.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative rounded-2xl border transition-all duration-300 ${isExpanded ? 'ring-1 ring-brand-500/20 shadow-xl' : 'shadow-sm'} ${task.completed
        ? 'bg-surface-50 dark:bg-surface-900 border-black/5 dark:border-white/5 opacity-75'
        : `${config.bg} ${config.border} hover:shadow-md hover:translate-y-[-2px]`
        }`}
    >
      {/* Priority Glow / Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${config.gradient} opacity-80`} />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={handleCompletionToggle}
                className={`flex-shrink-0 transition-all duration-300 transform hover:scale-110 ${task.completed
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : 'text-surface-300 dark:text-surface-600 hover:text-brand-500'
                  }`}
              >
                {task.completed ? (
                  <CheckCircle2 size={18} fill="currentColor" fillOpacity={0.2} />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              <h3 className={`font-display font-bold text-sm truncate transition-all ${task.completed
                ? 'text-surface-400 line-through decoration-emerald-500/30'
                : 'text-surface-900 dark:text-white'
                }`}>
                {task.title}
              </h3>

              {/* Status Badge */}
              {!task.completed && (
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
                    {task.priority}
                  </div>
                  {task.timeTracking?.isTracking && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 animate-pulse"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                      <span className="font-mono text-[9px] font-bold ml-0.5 border-l border-brand-500/20 pl-1.5">
                        {formatTimeShort(Math.floor(currentTimeSpent / 1000))}
                      </span>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[10px] font-bold text-surface-500 dark:text-surface-400 tracking-tight">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-brand-500" />
                {task.startTime} - {task.endTime}
              </div>
              {task.location && (
                <div className="flex items-center gap-1.5 opacity-80">
                  <MapPin size={12} />
                  {task.location}
                </div>
              )}
              {task.category && (
                <div className="flex items-center gap-1.5 opacity-80">
                  <Tag size={12} />
                  {task.category}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onStartFocus?.(task); }}
              className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white transition-all shadow-sm"
              title="Focus Mode"
            >
              <Target size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all shadow-sm"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Task Details / Description */}
        <AnimatePresence>
          {isExpanded && task.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="mt-4 text-xs font-medium text-surface-600 dark:text-surface-400 leading-relaxed bg-black/5 dark:bg-white/5 p-3 rounded-xl">
                {task.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Quick Action Footer */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-brand-500 transition-colors"
            >
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {isExpanded ? 'Less' : 'More'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTimerSection(!showTimerSection); }}
              className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors ${showTimerSection ? 'text-brand-500' : 'text-surface-400 hover:text-brand-500'}`}
            >
              <Clock size={12} />
              Timer
            </button>
          </div>

          {progressPercent > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-20 h-1.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-brand-500"
                />
              </div>
              <span className="text-[10px] font-black text-brand-600">{Math.round(progressPercent)}%</span>
            </div>
          )}
        </div>

        {/* Timer Control Section */}
        <AnimatePresence>
          {showTimerSection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-xl bg-surface-100/50 dark:bg-surface-800/50 border border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleTracking?.(task.id); }}
                      className={`p-1.5 rounded-lg transition-all shadow-sm ${task.timeTracking?.isTracking
                        ? 'bg-rose-500 text-white shadow-rose-500/20'
                        : 'bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-105'
                        }`}
                    >
                      {task.timeTracking?.isTracking ? <Square size={12} /> : <Play size={12} fill="currentColor" />}
                    </button>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">Total Spent</div>
                      <div className="text-lg font-display font-black text-surface-900 dark:text-white tabular-nums">
                        {formatTimeShort(Math.floor(currentTimeSpent / 1000))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onResetTracking?.(task.id); }}
                    className="p-2 rounded-xl text-surface-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    title="Reset Timer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-surface-700 shadow-sm border border-black/5 dark:border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block mb-1">Estimated</span>
                    <span className="text-sm font-bold text-surface-900 dark:text-white tabular-nums">
                      {formatTimeShort(task.estimatedDuration || 0)}
                    </span>
                  </div>
                  <div className="p-1.5 px-3 rounded-lg bg-brand-500 text-white flex items-center justify-center cursor-pointer hover:bg-brand-600 transition-all shadow-sm">
                    <span className="text-[9px] font-black uppercase tracking-widest">+15 Min</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskItem;
