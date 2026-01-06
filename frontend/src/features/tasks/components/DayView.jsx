import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, MapPin, Tag, Calendar, Sparkles } from 'lucide-react';

const DayView = ({
  tasks,
  selectedDay,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
  onToggleCompletion,
  onOpenCompletionModal,
  onStartFocus
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTasksForDay = (day) => {
    return tasks.filter(task => task.day === day);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const dayName = getDayName(currentDate);
  const dayTasks = getTasksForDay(dayName);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getTaskPosition = (task) => {
    const [hours, minutes] = task.startTime.split(':').map(Number);
    const top = (hours * 60 + minutes) * (100 / 60); // 100px per hour for more breathing room
    const [endH, endM] = task.endTime.split(':').map(Number);
    const duration = (endH * 60 + endM) - (hours * 60 + minutes);
    const height = Math.max(40, duration * (100 / 60));

    return { top, height };
  };

  const priorityColors = {
    high: 'from-rose-500 to-red-600 border-rose-500/30 text-rose-950 dark:text-rose-100',
    medium: 'from-amber-500 to-orange-500 border-amber-500/30 text-amber-950 dark:text-amber-100',
    low: 'from-emerald-500 to-teal-600 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Day Navigation Header */}
      <div className="flex items-center justify-between bg-surface-100/30 dark:bg-surface-800/30 p-4 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-sm">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateDay(-1)}
          className="p-3 rounded-xl bg-white dark:bg-surface-700 shadow-sm border border-black/5 dark:border-white/5 text-surface-600 dark:text-surface-300 hover:text-brand-500"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar size={14} className="text-brand-500" />
            <h2 className="text-xl font-display font-black uppercase tracking-widest text-surface-900 dark:text-white">{dayName}</h2>
          </div>
          <div className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-tighter tabular-nums flex items-center justify-center gap-2">
            {formatDate(currentDate)}
            <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
            {dayTasks.length} Task{dayTasks.length !== 1 ? 's' : ''}
          </div>
        </div>

        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateDay(1)}
          className="p-3 rounded-xl bg-white dark:bg-surface-700 shadow-sm border border-black/5 dark:border-white/5 text-surface-600 dark:text-surface-300 hover:text-brand-500"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Timeline View */}
      <div className="relative glass-card p-6 overflow-hidden">
        <div className="flex relative">
          {/* Time Labels */}
          <div className="w-20 pr-6 border-r border-black/5 dark:border-white/5">
            {timeSlots.map(time => (
              <div
                key={time}
                className="h-[100px] flex items-start justify-end py-1"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 dark:text-surface-500 tabular-nums">
                  {time}
                </span>
              </div>
            ))}
          </div>

          {/* Tasks Timeline */}
          <div className="flex-1 relative ml-6">
            {/* Hour Grid Lines */}
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-[100px] border-b border-black/[0.03] dark:border-white/[0.03] relative"
              >
                <div className="absolute -left-6 top-0 w-6 h-px bg-black/[0.05] dark:border-white/[0.05]" />
              </div>
            ))}

            {/* Current Time Indicator (Visual) */}
            <div className="absolute inset-x-0 border-t-2 border-brand-500/20 z-0 pointer-events-none" style={{ top: '350px' }}>
              <div className="absolute left-0 -top-1.5 w-3 h-3 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50" />
            </div>

            {/* Tasks Overlay */}
            <AnimatePresence>
              {dayTasks.map((task, idx) => {
                const { top, height } = getTaskPosition(task);
                const colorClass = priorityColors[task.priority] || priorityColors.medium;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.01, zIndex: 10 }}
                    onClick={() => onTaskClick(task)}
                    className={`absolute left-0 right-0 rounded-2xl p-4 cursor-pointer transition-all shadow-premium border backdrop-blur-sm group overflow-hidden ${task.completed ? 'opacity-50 grayscale' : ''
                      }`}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      background: `rgba(${isDarkMode ? '255,255,255,0.03' : '0,0,0,0.02'})`
                    }}
                  >
                    {/* Priority Accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`} />

                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-display font-bold text-sm text-surface-900 dark:text-white truncate pr-2">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-1.5 tabular-nums text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-surface-400">
                            <Clock size={12} className="text-brand-500" />
                            {task.startTime.split(':')[0]}:{task.startTime.split(':')[1]}
                          </div>
                        </div>

                        {height > 80 && task.description && (
                          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {(height > 60) && (
                        <div className="flex items-center gap-4 mt-2">
                          {task.location && (
                            <div className="flex items-center text-[10px] font-bold text-surface-400 gap-1">
                              <MapPin size={10} />
                              {task.location}
                            </div>
                          )}
                          {task.category && (
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-600 gap-1">
                              <Tag size={10} />
                              {task.category}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Completion Checkmark */}
                    {task.completed && (
                      <div className="absolute right-3 bottom-3 text-emerald-500 shadow-sm">
                        <Sparkles size={16} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DayView;