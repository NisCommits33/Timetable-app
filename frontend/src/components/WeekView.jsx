// components/WeekView.jsx
import TaskItem from "./TaskItem";
/**
 * WeekView Component - Displays the weekly schedule grid
 * 
 * A responsive grid layout showing tasks for each day of the week.
 * Features a clean, minimalist design with smooth interactions and full dark mode support.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.tasks - Array of task objects
 * @param {Function} props.onDayClick - Callback when a day is clicked
 * @param {string|null} props.selectedDay - Currently selected day
 * @param {Function} props.onDeleteTask - Callback to delete a task
 * @param {Function} props.onEditTask - Callback to edit a task
 * @param {Function} props.onViewDetails - Callback to view task details
 */
export default function WeekView({ 
  tasks, 
  onDayClick, 
  selectedDay, 
  onDeleteTask, 
  onEditTask, 
  onViewDetails 
}) {
  // Array of days to display in the weekly view
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-3 p-2">
      {/* 
        Responsive grid layout:
        - Mobile (default): 1 column
        - sm (640px+): 2 columns  
        - md (768px+): 3 columns
        - lg (1024px+): 4 columns
        - xl (1280px+): 5 columns
        - 2xl (1536px+): 7 columns (all days in one row)
      */}
      
      {days.map(dayName => {
        // Filter tasks for the current day
        const tasksForToday = tasks.filter(task => task.day === dayName);
        
        return (
          <div
            key={dayName}
            onClick={() => onDayClick(dayName)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
              ${dayName === selectedDay
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 shadow-md' // Selected day styling
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500' // Default styling
              }`}
          >
            {/* Day Header Section */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {dayName}
              </h3>
              
              {/* Task count badge with conditional coloring */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tasksForToday.length > 0
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' // Has tasks - green
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'   // No tasks - gray
              }`}>
                {tasksForToday.length} task{tasksForToday.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Tasks List Section */}
            <div className="space-y-2">
              {tasksForToday.length > 0 ? (
                // Display tasks if they exist
                tasksForToday.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                    onViewDetails={onViewDetails}
                  />
                ))
              ) : (
                // Display empty state if no tasks
                <div className="text-center py-4">
                  <svg 
                    className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No tasks scheduled
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}