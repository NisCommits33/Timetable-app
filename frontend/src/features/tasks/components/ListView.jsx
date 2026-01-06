import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, LayoutList, Sparkles, SlidersHorizontal } from 'lucide-react';
import TaskItem from './TaskItem';

const ListView = ({
  tasks,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
  onToggleCompletion,
  onOpenCompletionModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('time');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
          (filter === 'completed' && task.completed) ||
          (filter === 'pending' && !task.completed);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case 'title':
            return a.title.localeCompare(b.title);
          case 'time':
          default:
            return a.startTime.localeCompare(b.startTime);
        }
      });
  }, [tasks, searchTerm, filter, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-100/30 dark:bg-surface-800/30 p-4 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text"
            placeholder="Filter tasks by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-surface-700 border border-black/5 dark:border-white/5 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-700 border border-black/5 dark:border-white/5">
            <Filter size={14} className="text-brand-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">In Progress</option>
              <option value="completed">Finished</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-700 border border-black/5 dark:border-white/5">
            <SlidersHorizontal size={14} className="text-brand-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="time">Sort by Time</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          <div className="h-8 w-px bg-black/5 dark:bg-white/5 hidden sm:block mx-2" />

          <div className="flex flex-col items-end">
            <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">Total</div>
            <div className="text-sm font-display font-black text-surface-900 dark:text-white">{filteredTasks.length} Result{filteredTasks.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-24 flex flex-col items-center justify-center glass-card border-dashed border-2 opacity-40"
            >
              <LayoutList size={48} className="mb-4" />
              <h3 className="text-xl font-display font-bold">No tasks found</h3>
              <p className="text-sm font-medium">Try adjusting your filters or search terms.</p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
              >
                <TaskItem
                  task={task}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onViewDetails={onTaskClick}
                  isDarkMode={isDarkMode}
                  onToggleTracking={onToggleTracking}
                  onAddManualTime={onAddManualTime}
                  onResetTracking={onResetTracking}
                  onToggleCompletion={onToggleCompletion}
                  onOpenCompletionModal={onOpenCompletionModal}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ListView;