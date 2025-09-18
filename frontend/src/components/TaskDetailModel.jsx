// components/TaskDetailModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Place as LocationIcon,
  Notes as NotesIcon,
  PriorityHigh as PriorityIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

function TaskDetailModal({ open, task, onClose, onEdit, onDelete }) {
  if (!task) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box className="flex items-center justify-between">
          <Typography variant="h6">{task.title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Priority and Category */}
        <Box className="flex gap-2 mb-4">
          <Chip
            icon={<PriorityIcon />}
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
          />
          <Chip
            icon={<CategoryIcon />}
            label={task.category}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Description */}
        {task.description && (
          <Box className="mb-4">
            <Typography variant="body2" color="textSecondary">
              {task.description}
            </Typography>
          </Box>
        )}

        <Divider className="my-4" />

        {/* Time */}
        <Box className="flex items-center gap-2 mb-3">
          <ScheduleIcon className="h-4 w-4 text-gray-500" />
          <Typography variant="body2">
            {task.startTime} - {task.endTime} • {task.day}
          </Typography>
        </Box>

        {/* Location */}
        {task.location && (
          <Box className="flex items-center gap-2 mb-3">
            <LocationIcon className="h-4 w-4 text-gray-500" />
            <Typography variant="body2">{task.location}</Typography>
          </Box>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Box className="mb-4">
            <Typography variant="caption" color="textSecondary" className="block mb-1">
              Tags:
            </Typography>
            <Box className="flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {/* Notes */}
        {task.notes && (
          <Box className="mb-4">
            <Box className="flex items-center gap-2 mb-2">
              <NotesIcon className="h-4 w-4 text-gray-500" />
              <Typography variant="subtitle2">Notes</Typography>
            </Box>
            <Typography variant="body2" className="bg-gray-50 p-3 rounded-lg">
              {task.notes}
            </Typography>
          </Box>
        )}

        {/* Metadata */}
        <Divider className="my-4" />
        <Typography variant="caption" color="textSecondary">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => onEdit(task)} variant="outlined">
          Edit
        </Button>
        <Button 
          onClick={() => onDelete(task.id)} 
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDetailModal;