// components/WeekView.jsx
import TaskItem from './TaskItem';
import { Paper, Typography, Box } from '@mui/material';
import { EventAvailable } from '@mui/icons-material';

export default function WeekView({ tasks, onDayClick, selectedDay, onDeleteTask }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {days.map(dayName => {
        const tasksForToday = tasks.filter(task => task.day === dayName);
        
        return (
          <Paper
            key={dayName}
            elevation={0}
            onClick={() => onDayClick(dayName)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
              dayName === selectedDay
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between mb-3">
              <Typography 
                variant="subtitle1" 
                className="font-semibold text-gray-900"
              >
                {dayName}
              </Typography>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tasksForToday.length > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tasksForToday.length} task{tasksForToday.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Tasks List */}
            <Box className="space-y-2">
              {tasksForToday.length > 0 ? (
                tasksForToday.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onDelete={onDeleteTask} 
                  />
                ))
              ) : (
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