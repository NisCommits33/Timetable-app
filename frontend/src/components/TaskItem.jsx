// components/TaskItem.jsx
import { Paper, Typography, IconButton, Box } from '@mui/material';
import { Delete, Schedule } from '@mui/icons-material';

function TaskItem({ task, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <Paper 
      elevation={0}
      className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
    >
      <Box className="flex items-center justify-between">
        <Box className="flex-1 min-w-0">
          <Typography 
            variant="body2" 
            className="font-medium text-gray-900 truncate"
          >
            {task.title}
          </Typography>
          <Box className="flex items-center mt-1">
            <Schedule className="h-3 w-3 mr-1 text-gray-600" />
            <Typography 
              variant="caption" 
              className="text-gray-600"
            >
              {task.startTime} - {task.endTime}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={handleDeleteClick}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
          title="Delete task"
        >
          <Delete className="h-4 w-4" />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default TaskItem;