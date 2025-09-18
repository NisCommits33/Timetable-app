// components/AddTaskForm.jsx
import { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
  TextareaAutosize
} from '@mui/material';
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Place as LocationIcon,
  Notes as NotesIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';

function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // NEW
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [day, setDay] = useState('Monday');
  const [priority, setPriority] = useState('medium'); // NEW
  const [location, setLocation] = useState(''); // NEW
  const [notes, setNotes] = useState(''); // NEW
  const [tags, setTags] = useState([]); // NEW
  const [currentTag, setCurrentTag] = useState(''); // NEW

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTask = {
      id: Date.now(),
      title,
      description, // NEW
      startTime,
      endTime,
      date: new Date().toISOString().split('T')[0],
      day,
      priority, // NEW
      location, // NEW
      notes, // NEW
      tags, // NEW
      category: "personal",
      completed: false,
      completedAt: null,
      timeSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('10:00');
    setDay('Monday');
    setPriority('medium');
    setLocation('');
    setNotes('');
    setTags([]);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <TextField
        fullWidth
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        variant="outlined"
        size="small"
      />

      {/* Description - NEW */}
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={2}
        variant="outlined"
        size="small"
      />

      {/* Time Grid */}
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

      {/* Day and Priority - NEW */}
      <Box className="grid grid-cols-2 gap-3">
        <TextField
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

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PriorityIcon className="h-4 w-4" />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
      </Box>

      {/* Location - NEW */}
      <TextField
        fullWidth
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationIcon className="h-4 w-4" />
            </InputAdornment>
          ),
        }}
      />

      {/* Tags - NEW */}
      <div>
        <TextField
          fullWidth
          label="Add Tags (Press Enter)"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyPress={handleAddTag}
          variant="outlined"
          size="small"
        />
        <Box className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              onDelete={() => setTags(tags.filter((_, i) => i !== index))}
            />
          ))}
        </Box>
      </div>

      {/* Notes - NEW */}
      <TextField
        fullWidth
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={2}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NotesIcon className="h-4 w-4" />
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        startIcon={<AddIcon />}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Add Task
      </Button>
    </Box>
  );
}

export default AddTaskForm;