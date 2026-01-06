import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { SortableTaskItem } from './SortableTaskItem';
import { DayDropZone } from './DayDropZone';
import { Calendar, ChevronRight, LayoutGrid, Columns, List } from 'lucide-react';

export default function WeekView({
  tasks,
  onDayClick,
  selectedDay,
  onDeleteTask,
  onEditTask,
  onViewDetails,
  onTaskMove,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
  onToggleCompletion,
  onOpenCompletionModal,
  onStartFocus
}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Smart Day Ordering: Start with today
  const orderedDays = useMemo(() => {
    const today = new Date().getDay(); // 0 is Sunday, 1 is Monday
    const todayIndex = today === 0 ? 6 : today - 1; // Map Sunday to 6, Monday to 0
    return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
  }, []);

  const [activeTask, setActiveTask] = useState(null);
  const [columnConfig, setColumnConfig] = useState('adaptive'); // 'adaptive', '3', '5', '7'

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(active.data.current?.task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = active.data.current?.task;
    const overTask = over.data.current?.task;
    const overDay = over.data.current?.day;

    if (!activeTask) return;
    const targetDay = overDay || overTask?.day;

    if (targetDay && targetDay !== activeTask.day) {
      onTaskMove({
        task: activeTask,
        targetDay: targetDay,
        targetTaskId: overTask?.id,
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-end gap-2 mb-4 bg-surface-100/50 dark:bg-surface-800/50 p-1.5 rounded-xl border border-black/5 dark:border-white/5 self-end w-fit">
        {[
          { id: 'adaptive', icon: LayoutGrid, label: 'Auto' },
          { id: '3', icon: Columns, label: '3 Col' },
          { id: '5', icon: Columns, label: '5 Col' },
          { id: '7', icon: LayoutGrid, label: '7 Col' }
        ].map(cfg => (
          <button
            key={cfg.id}
            onClick={() => setColumnConfig(cfg.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${columnConfig === cfg.id
              ? 'bg-white dark:bg-surface-700 text-brand-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-200'
              }`}
          >
            <cfg.icon size={12} />
            <span className="hidden sm:inline">{cfg.label}</span>
          </button>
        ))}
      </div>

      <div className={`grid gap-6 mt-4 ${columnConfig === 'adaptive' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7' :
        columnConfig === '3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          columnConfig === '5' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7'
        }`}>
        {orderedDays.map((dayName, index) => {
          const tasksForToday = tasks.filter(task => task.day === dayName);
          const isSelected = dayName === selectedDay;

          return (
            <motion.div
              key={dayName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onDayClick(dayName)}
              className={`flex flex-col h-full min-h-[400px] rounded-2xl border transition-all duration-300 group cursor-pointer ${isSelected
                ? 'bg-blue-500/5 border-blue-500/30 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10'
                : 'bg-surface-50/50 dark:bg-surface-900/50 border-black/5 dark:border-white/5 hover:border-brand-500/30 hover:bg-white dark:hover:bg-surface-800'
                }`}
            >
              {/* Day Header */}
              <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'} transition-colors`}>
                    <Calendar size={14} />
                  </div>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-surface-900 dark:text-white' : 'text-surface-500 dark:text-surface-400 font-bold'}`}>
                    {dayName.slice(0, 3)}
                  </h3>
                </div>

                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tasksForToday.length > 0
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500'
                  }`}>
                  {tasksForToday.length}
                </div>
              </div>

              {/* Day Content */}
              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                <SortableContext
                  items={tasksForToday.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[100px]">
                    {tasksForToday.length > 0 ? (
                      tasksForToday.map(task => (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          onDelete={onDeleteTask}
                          onEdit={onEditTask}
                          onViewDetails={onViewDetails}
                          isDarkMode={isDarkMode}
                          onToggleTracking={onToggleTracking}
                          onAddManualTime={onAddManualTime}
                          onResetTracking={onResetTracking}
                          onToggleCompletion={onToggleCompletion}
                          onOpenCompletionModal={onOpenCompletionModal}
                          onStartFocus={onStartFocus}
                        />
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-10 opacity-20 group-hover:opacity-40 transition-opacity">
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-current mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Empty</span>
                      </div>
                    )}
                    <DayDropZone day={dayName} isDarkMode={isDarkMode} />
                  </div>
                </SortableContext>
              </div>

              {/* Footer Indicator */}
              {isSelected && (
                <div className="py-2 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 rounded-b-xl border-t border-blue-500/20">
                  <ChevronRight size={12} className="animate-pulse" />
                  Focused Day
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask ? (
          <div className="scale-105 rotate-3 shadow-2xl rounded-2xl overflow-hidden glass-card p-4 border-brand-500/50 border-2 cursor-grabbing opacity-90">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${activeTask.priority === 'high' ? 'bg-red-500' :
                activeTask.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                } shadow-lg`} />
              <div>
                <h3 className="font-display font-bold text-sm text-surface-900 dark:text-white">
                  {activeTask.title}
                </h3>
                <p className="text-[10px] font-bold text-surface-500 dark:text-surface-400 tracking-tight">
                  {activeTask.startTime} - {activeTask.endTime}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}