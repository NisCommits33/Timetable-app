// components/ListView.jsx
import { useState } from 'react';
import { Search, Filter, SortAsc, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

const ListView = ({ 
  tasks, 
  onTaskClick, 
  onEditTask, 
  onDeleteTask, 
  isDarkMode,
  onToggleTracking,
  onToggleCompletion,        // This should exist
  onOpenCompletionModal 
  

}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [sortBy, setSortBy] = useState('time'); // time, priority, title

  // Filter and sort tasks
  const filteredTasks = tasks
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
     // Update the completion handler in ListView
  const toggleTaskCompletion = (taskId, e) => {
    e.stopPropagation();
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // Open completion modal for incomplete tasks
      if (onOpenCompletionModal) {
        onOpenCompletionModal(task);
      }
    } else {
      // Simple toggle for completed tasks
      if (onToggleCompletion) {
        onToggleCompletion(taskId);
      }
    }
  };

  

  return (
    <div className={`rounded-xl border p-6 ${
      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-semibold">All Tasks</h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'
              }`}
            />
          </div>
          
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
            }`}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
            }`}
          >
            <option value="time">Sort by Time</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className={`text-center py-12 rounded-lg border-2 border-dashed ${
            isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
          }`}>
            <p>No tasks found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`p-4 rounded-lg border transition-all cursor-pointer group ${
                task.completed
                  ? isDarkMode
                    ? 'border-gray-600 bg-gray-700/50 opacity-60'
                    : 'border-gray-300 bg-gray-100 opacity-60'
                  : isDarkMode
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* Completion Checkbox */}
                  <button
                    onClick={(e) => toggleTaskCompletion(task.id, e)}
                    className={`mt-1 flex-shrink-0 ${
                      task.completed
                        ? 'text-green-500'
                        : isDarkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium truncate ${
                        task.completed
                          ? 'line-through'
                          : isDarkMode
                          ? 'text-gray-200'
                          : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {/* Priority Indicator */}
                      {task.priority === 'high' && (
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      
                      {/* Time Tracking Indicator */}
                      {task.timeTracking?.isTracking && (
                        <div className="flex items-center space-x-1 text-green-500 text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span>Tracking</span>
                        </div>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mb-2 line-clamp-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    {/* Task Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className={`flex items-center space-x-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Clock className="h-3 w-3" />
                        <span>{task.startTime} - {task.endTime}</span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {task.priority}
                      </span>
                      
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {task.day}
                      </span>
                      
                      {task.location && (
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {task.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    className={`p-1.5 rounded ${
                      isDarkMode 
                        ? 'hover:bg-gray-500 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTracking(task.id);
                    }}
                    className={`p-1.5 rounded ${
                      task.timeTracking?.isTracking
                        ? 'text-red-500 hover:bg-red-500/10'
                        : isDarkMode
                        ? 'text-green-400 hover:bg-green-500/10'
                        : 'text-green-600 hover:bg-green-500/10'
                    }`}
                  >
                    {task.timeTracking?.isTracking ? (
                      <Square className="h-4 w-4" />
                    ) : (
                      <play className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListView;