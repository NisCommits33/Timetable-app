// components/WeekView.jsx
import { Paper, Typography, Box } from '@mui/material';
import { EventAvailable } from '@mui/icons-material';
import TaskItem from './TaskItem'

/**
 * WeekView Component - Displays the weekly schedule grid
 * @param {Object} props - Component properties
 * @param {Array} props.tasks - Array of task objects
 * @param {Function} props.onDayClick - Callback when a day is clicked
 * @param {string|null} props.selectedDay - Currently selected day
 * @param {Function} props.onDeleteTask - Callback to delete a task
 * @param {Function} props.onEditTask - Callback to edit a task (NEW)
 */
export default function WeekView({ tasks, onDayClick, selectedDay, onDeleteTask, onEditTask,onViewDetails }) {
  // Array of days to display in the weekly view
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-1 gap-1">
      {/* 
        Responsive grid breakdown:
        - Mobile (default): 1 column
        - sm (640px+): 2 columns  
        - md (768px+): 3 columns
        - lg (1024px+): 4 columns
        - xl (1280px+): 5 columns
        - 2xl (1536px+): 7 columns (all days in one row for 1920×1080)
      */}
      {/* Map through each day to create a day card */}
      {days.map(dayName => {
        // Filter tasks for the current day
        const tasksForToday = tasks.filter(task => task.day === dayName);
        
        return (
          <Paper
            key={dayName}
            elevation={0}
            onClick={() => onDayClick(dayName)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
              dayName === selectedDay
                ? 'border-blue-500 bg-blue-50 shadow-md' // Selected day styling
                : 'border-gray-200 bg-white hover:border-gray-300' // Default styling
            }`}
          >
            {/* Day Header Section */}
            <div className="flex items-center justify-between mb-3">
              <Typography 
                variant="subtitle1" 
                className="font-semibold text-gray-900"
              >
                {dayName}
              </Typography>
              {/* Task count badge with conditional coloring */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tasksForToday.length > 0
                  ? 'bg-green-100 text-green-800' // Has tasks - green
                  : 'bg-gray-100 text-gray-600'   // No tasks - gray
              }`}>
                {tasksForToday.length} task{tasksForToday.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Tasks List Section */}
            <Box className="space-y-2">
              {tasksForToday.length > 0 ? (
                // Display tasks if they exist
                tasksForToday.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onDelete={onDeleteTask}
                    onEdit={onEditTask} /* ← Pass edit callback */
                    onViewDetails={onViewDetails}

                  />
                ))
              ) : (
                // Display empty state if no tasks
                <Box className="text-center py-4">
                  <EventAvailable className="text-gray-400 mx-auto mb-2" />
                  <Typography 
                    variant="body2" 
                    className="text-gray-500"
                  >
                    No tasks scheduled
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        );
      })}
    </div>
  );
}