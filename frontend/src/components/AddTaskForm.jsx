// components/AddTaskForm.jsx
import { useState } from 'react';
import { 
  TextField, 
  Button, 
  MenuItem, 
  Box,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon,
  Schedule as ScheduleIcon 
} from '@mui/icons-material';

function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [day, setDay] = useState('Monday');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTask = {
      id: Date.now(),
      title,
      startTime,
      endTime,
      date: new Date().toISOString().split('T')[0],
      day
    };

    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setDay('Monday');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        required
        variant="outlined"
        size="small"
      />

      <Box className="grid grid-cols-2 gap-3">
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ScheduleIcon className="h-4 w-4" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          variant="outlined"
          size="small"
        />
      </Box>

      <TextField
        fullWidth
        select
        label="Day of Week"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        variant="outlined"
        size="small"
      >
        <MenuItem value="Monday">Monday</MenuItem>
        <MenuItem value="Tuesday">Tuesday</MenuItem>
        <MenuItem value="Wednesday">Wednesday</MenuItem>
        <MenuItem value="Thursday">Thursday</MenuItem>
        <MenuItem value="Friday">Friday</MenuItem>
        <MenuItem value="Saturday">Saturday</MenuItem>
        <MenuItem value="Sunday">Sunday</MenuItem>
      </TextField>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        startIcon={<AddIcon />}
        className="bg-blue-600 hover:bg-blue-700 shadow-none hover:shadow-md"
      >
        Add Task
      </Button>
    </Box>
  );
}

export default AddTaskForm;