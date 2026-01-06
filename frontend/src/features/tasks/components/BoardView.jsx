/**
 * BoardView Component
 * Kanban-style board view for organizing tasks by status
 */

import { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';

const BoardView = ({
    tasks,
    onTaskClick,
    onEditTask,
    onDeleteTask,
    isDarkMode,
    onToggleCompletion,
}) => {
    const [draggedTask, setDraggedTask] = useState(null);

    // Define board columns (can be customized)
    const columns = [
        { id: 'todo', title: 'To Do', color: 'blue' },
        { id: 'in-progress', title: 'In Progress', color: 'yellow' },
        { id: 'completed', title: 'Completed', color: 'green' },
    ];

    // Categorize tasks by status
    const getTasksByStatus = (status) => {
        if (status === 'completed') {
            return tasks.filter(task => task.completed);
        } else if (status === 'in-progress') {
            return tasks.filter(task => !task.completed && task.timeTracking?.isTracking);
        } else {
            // todo - not completed and not currently tracking
            return tasks.filter(task => !task.completed && !task.timeTracking?.isTracking);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (status) => {
        if (!draggedTask) return;

        if (status === 'completed' && !draggedTask.completed) {
            onToggleCompletion(draggedTask.id);
        } else if (status !== 'completed' && draggedTask.completed) {
            onToggleCompletion(draggedTask.id);
        }

        setDraggedTask(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-500';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'work':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'personal':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'fitness':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'learning':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getColumnColor = (color) => {
        const colors = {
            blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
            yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
            green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        };
        return colors[color] || '';
    };

    return (
        <div className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {columns.map((column) => {
                    const columnTasks = getTasksByStatus(column.id);

                    return (
                        <div
                            key={column.id}
                            className={`flex flex-col rounded-lg border ${getColumnColor(column.color)} ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
                                }`}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(column.id)}
                        >
                            {/* Column Header */}
                            <div className="p-4 border-b border-current/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">{column.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700' : 'bg-white'
                                        }`}>
                                        {columnTasks.length}
                                    </span>
                                </div>
                            </div>

                            {/* Tasks */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                {columnTasks.length === 0 ? (
                                    <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                        No tasks
                                    </div>
                                ) : (
                                    columnTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={() => handleDragStart(task)}
                                            onClick={() => onTaskClick(task)}
                                            className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)} cursor-pointer transition-all hover:shadow-md ${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                                                    : 'bg-white border-gray-200 hover:shadow-lg'
                                                } ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                                        >
                                            {/* Task Title */}
                                            <h4 className="font-medium mb-2 line-clamp-2">{task.title}</h4>

                                            {/* Task Meta */}
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {task.day} • {task.startTime}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(task.category)}`}>
                                                    {task.category}
                                                </span>
                                            </div>

                                            {/* Tags */}
                                            {task.tags && task.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {task.tags.slice(0, 3).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className={`px-2 py-0.5 rounded text-xs ${isDarkMode
                                                                    ? 'bg-gray-600 text-gray-300'
                                                                    : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {task.tags.length > 3 && (
                                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            +{task.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Description Preview */}
                                            {task.description && (
                                                <p className={`mt-2 text-xs line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Task Button */}
                            <div className="p-3 border-t border-current/10">
                                <button
                                    className={`w-full px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${isDarkMode
                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm">Add Task</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No tasks to display
                        </p>
                        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Create your first task to get started
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardView;
