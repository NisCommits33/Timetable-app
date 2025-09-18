// components/TaskItem.jsx
import { useState } from 'react'; // ← MUST ADD THIS IMPORT
import { Paper, Typography, IconButton, Box} from '@mui/material';
import { Delete, Schedule, Edit,Visibility  } from '@mui/icons-material';

/**
 * TaskItem Component - Displays an individual task with actions
 * @param {Object} props - Component properties
 * @param {Object} props.task - The task object to display
 * @param {Function} props.onDelete - Callback to delete this task
 * @param {Function} props.onEdit - Callback to edit this task (NEW)
 * @param {Function} props.onViewDetails - Callback to view task details
 */
function TaskItem({ task, onDelete, onEdit, onViewDetails }) {
  const [showActions, setShowActions] = useState(false);
   const handleCardClick = () => {
    onViewDetails(task); // NEW: Open detail view instead of edit
  };
  return (
    <Paper 
      elevation={0}
      className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer
                 lg:p-3" // ← More padding on large screens
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onViewDetails(task)}
    >
      <Box className="flex items-center justify-between">
        <Box className="flex-1 min-w-0">
          <Typography 
            variant="body2" 
            className="font-medium text-gray-900 truncate text-sm lg:text-base"
          >
            {task.title}
          </Typography>
          <Box className="flex items-center mt-1">
            <Schedule className="h-3 w-3 mr-1 text-gray-600 lg:h-4 lg:w-4" />
            <Typography 
              variant="caption" 
              className="text-gray-600 text-xs lg:text-sm"
            >
              {task.startTime} - {task.endTime}
            </Typography>
          </Box>
        </Box>
        
        {showActions && (
          <Box className="flex space-x-1">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              className="text-gray-400 hover:text-blue-500 hover:bg-blue-50
                         h-8 w-8 lg:h-10 lg:w-10" // ← Larger buttons on big screens
              title="Edit task"
            >
              <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50
                         h-8 w-8 lg:h-10 lg:w-10"
              title="Delete task"
            >
              <Delete className="h-3 w-3 lg:h-4 lg:w-4" />
            </IconButton>
            <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); onViewDetails(task); }}
        className="text-gray-400 hover:text-blue-500 hover:bg-blue-50"
        title="View details"
      >
        <Visibility className="h-3 w-3" />
      </IconButton>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
export default TaskItem;