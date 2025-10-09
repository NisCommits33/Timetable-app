// components/DayView.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Tag } from 'lucide-react';

const DayView = ({ 
  tasks, 
  selectedDay, 
  onTaskClick, 
  onEditTask, 
  onDeleteTask, 
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get tasks for the selected day
  const getTasksForDay = (day) => {
    return tasks.filter(task => task.day === day);
  };

  // Navigate to previous/next day
  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  // Get day name from date
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Format date display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const dayName = getDayName(currentDate);
  const dayTasks = getTasksForDay(dayName);
  
  // Generate time slots for the day
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getTaskPosition = (task) => {
    const [hours, minutes] = task.startTime.split(':').map(Number);
    const top = (hours * 60 + minutes) * (80 / 60); // 80px per hour
    const duration = calculateDurationMinutes(task.startTime, task.endTime);
    const height = duration * (80 / 60);
    
    return { top, height };
  };

  return (
    <div className={`rounded-xl border p-6 ${
      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      {/* Day Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateDay(-1)}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">{dayName}</h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formatDate(currentDate)}
          </p>
          <p className={`text-xs mt-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        
        <button
          onClick={() => navigateDay(1)}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Timeline View */}
      <div className="relative">
        {/* Time Labels */}
        <div className="flex">
          <div className="w-16 flex-shrink-0">
            {timeSlots.map(time => (
              <div 
                key={time} 
                className="h-20 border-b flex items-start justify-end pr-2 py-1"
                style={{ minHeight: '80px' }}
              >
                <span className={`text-xs font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {time}
                </span>
              </div>
            ))}
          </div>
          
          {/* Tasks Timeline */}
          <div className="flex-1 relative">
            {/* Hour Grid */}
            {timeSlots.map((time, index) => (
              <div 
                key={time}
                className={`h-20 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
                style={{ minHeight: '80px' }}
              />
            ))}
            
            {/* Tasks Overlay */}
            {dayTasks.map(task => {
              const { top, height } = getTaskPosition(task);
              
              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className={`absolute left-2 right-2 rounded-lg p-3 cursor-pointer transition-all shadow-lg border-l-4 ${
                    task.priority === 'high' 
                      ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' 
                      : task.priority === 'medium'
                      ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                  } hover:shadow-xl hover:scale-[1.02]`}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold text-sm ${
                      task.priority === 'high' 
                        ? 'text-red-900 dark:text-red-100'
                        : task.priority === 'medium'
                        ? 'text-yellow-900 dark:text-yellow-100'
                        : 'text-green-900 dark:text-green-100'
                    }`}>
                      {task.title}
                    </h3>
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.startTime} - {task.endTime}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className={`text-xs mt-1 line-clamp-2 ${
                      task.priority === 'high' 
                        ? 'text-red-700 dark:text-red-300'
                        : task.priority === 'medium'
                        ? 'text-yellow-700 dark:text-yellow-300'
                        : 'text-green-700 dark:text-green-300'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  
                  {/* Task Meta */}
                  <div className="flex items-center space-x-2 mt-2">
                    {task.location && (
                      <div className="flex items-center text-xs opacity-75">
                        <MapPin className="h-3 w-3 mr-1" />
                        {task.location}
                      </div>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center text-xs opacity-75">
                        <Tag className="h-3 w-3 mr-1" />
                        {task.tags.length}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task List for Small Screens */}
      <div className="mt-6 lg:hidden">
        <h3 className={`font-semibold mb-3 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Task List
        </h3>
        <div className="space-y-2">
          {dayTasks.map(task => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border-l-4 cursor-pointer ${
                task.priority === 'high' 
                  ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' 
                  : task.priority === 'medium'
                  ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-l-green-500 bg-green-50 dark:bg-green-900/20'
              }`}
              onClick={() => onTaskClick(task)}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{task.title}</h4>
                <span className="text-xs opacity-75">
                  {task.startTime} - {task.endTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate duration in minutes
const calculateDurationMinutes = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  return (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
};

export default DayView;