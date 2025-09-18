/// App.jsx
import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Paper,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material'; // ← Added Dialog components
import { 
  CalendarToday as CalendarIcon, 
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material'; // ← Added EditIcon
import AddTaskForm from './components/AddTaskForm';
import WeekView from './components/WeekView';

// ... your initialTasks array remains the same ...
const initialTasks = [
  {
    id: 1,
    title: "Morning Freshness",
    startTime: "7:00",
    endTime: "7:30",
    date: "2025/08/28",
    day: "Monday",
    priority: "High",


  }
];
function App() {
  // State for tasks loaded from localStorage or initial data
 // Custom hook for robust localStorage management with error handling
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      // Attempt to retrieve item from localStorage
      const storedValue = localStorage.getItem(key);
      // Parse JSON data, fallback to initialValue if null or parsing fails
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      // Log error but don't crash the app - return initial value instead
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Effect to persist data to localStorage whenever value changes
  useEffect(() => {
    try {
      // Stringify and store the value
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Handle errors like quota exceeded or storage disabled
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, value]); // Re-run when key or value changes

  // Return state and setter just like useState
  return [value, setValue];
};

// Usage in component
const [tasks, setTasks] = useLocalStorage('timetable-tasks', initialTasks);
  
  // State to track which day is selected in the week view
  const [selectedDay, setSelectedDay] = useState(null);
  
  // State for editing functionality
  const [editingTask, setEditingTask] = useState(null);        // Stores the task being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls edit modal visibility

  /**
   * Validates if a new task time conflicts with existing tasks
   * @param {Object} newTask - The task to validate
   * @param {number|null} editingId - ID of task being edited (skip conflict check with itself)
   * @returns {boolean} - True if no conflict, False if conflict exists
   */
  const validateTaskTime = (newTask, editingId = null) => {
    return !tasks.some(task => {
      // Skip conflict check with the task we're currently editing
      if (task.id === editingId) return false;
      
      // Only check tasks on the same day (no cross-day conflicts)
      if (task.day !== newTask.day) return false;
      
      // Convert time strings to minutes for easier comparison
      // Example: "07:30" becomes 450 minutes (7*60 + 30)
      const toMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const newStart = toMinutes(newTask.startTime);
      const newEnd = toMinutes(newTask.endTime);
      const existingStart = toMinutes(task.startTime);
      const existingEnd = toMinutes(task.endTime);
      
      // Check for time overlap: new task starts before existing task ends 
      // AND new task ends after existing task starts
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  /**
   * Handles day selection in the week view
   * @param {string} clickedDay - The day that was clicked
   */
  const handleDayClick = (clickedDay) => {
    setSelectedDay(clickedDay);
  };

  /**
   * Adds a new task to the schedule after validation
   * @param {Object} newTask - The task to add
   */
  const addTask = (newTask) => {
    // Validate for time conflicts before adding
    if (!validateTaskTime(newTask)) {
      alert('⏰ Time conflict! This time slot overlaps with an existing task.');
      return;
    }
    // Add task to state (which will trigger localStorage save via useEffect)
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  /**
   * Deletes a task from the schedule
   * @param {number} taskIdToDelete - ID of the task to delete
   */
  const deleteTask = (taskIdToDelete) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskIdToDelete));
  };

  /**
   * Opens the edit modal for a task
   * @param {Object} task - The task to edit
   */
  const handleEditTask = (task) => {
    setEditingTask(task);          // Store the task being edited
    setIsEditModalOpen(true);      // Open the edit modal
  };

  /**
   * Saves the edited task after validation
   * @param {Object} updatedTask - The task with edits applied
   */
  const handleSaveEdit = (updatedTask) => {
    // Validate edited task (pass the ID to skip conflict with itself)
    if (!validateTaskTime(updatedTask, updatedTask.id)) {
      alert('⏰ Time conflict! This time slot overlaps with an existing task.');
      return;
    }
    
    // Update the task in the state array
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    
    // Close the edit modal
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  /**
   * Closes the edit modal without saving
   */
  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('timetable-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [tasks]); // Dependency array: runs when 'tasks' changes
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with app title and new task button */}
      <AppBar 
        position="static" 
        elevation={0}
        className="bg-white border-b border-gray-200"
      >
        <Toolbar className="flex justify-between px-4 lg:px-8">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="text-blue-600" />
            <Typography 
              variant="h6" 
              className="text-gray-900 font-bold"
            >
              Timetable App
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="bg-blue-600 hover:bg-blue-700 shadow-none hover:shadow-md"
          >
            New Task
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Container  maxWidth="xl" 
      className="py-6 lg:py-8 px-4 lg:px-6"
      style={{ maxWidth: '1920px' }} // Constrain max width for ultra-wide screens 
      >
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 2xl:gap-8">
          
          {/* Left sidebar - Add Task Form */}
          <div className="lg:col-span-1">
            <Paper 
              elevation={0}
              className="p-4 lg:p-6 rounded-2xl border border-gray-200 sticky top-6"
            >
              <Typography 
                variant="h6" 
                className="text-gray-900 font-semibold mb-4"
              >
                Add New Task
              </Typography>
              <AddTaskForm onAddTask={addTask} />
            </Paper>
          </div>

          {/* Right main area - Week View */}
          <div className="xl:col-span-3">
            <Paper 
              elevation={0}
              className="p-4 lg:p-6 rounded-2xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <Typography 
                  variant="h6" 
                  className="text-gray-900 font-semibold"
                >
                  Weekly Schedule
                </Typography>
                {selectedDay && (
                  <Chip 
                    label={`Viewing: ${selectedDay}`}
                    className="bg-blue-50 text-blue-700"
                    size="small"
                  />
                )}
              </div>
              
              {/* Week View component displaying tasks by day */}
              <WeekView 
                tasks={tasks} 
                onDayClick={handleDayClick} 
                selectedDay={selectedDay}
                onDeleteTask={deleteTask}
                onEditTask={handleEditTask} /* ← Pass edit function */
              />
            </Paper>
          </div>
        </div>
      </Container>

      {/* Edit Task Modal Dialog */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={handleCloseEdit} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <div className="flex items-center">
            <EditIcon className="mr-2 text-blue-600" />
            Edit Task
          </div>
        </DialogTitle>
        <DialogContent>
          {editingTask && (
            <div className="space-y-4 mt-2">
              <TextField
                fullWidth
                label="Task Title"
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={editingTask.startTime}
                onChange={(e) => setEditingTask({...editingTask, startTime: e.target.value})}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={editingTask.endTime}
                onChange={(e) => setEditingTask({...editingTask, endTime: e.target.value})}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                select
                label="Day of Week"
                value={editingTask.day}
                onChange={(e) => setEditingTask({...editingTask, day: e.target.value})}
                variant="outlined"
              >
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
              </TextField>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button 
            onClick={() => handleSaveEdit(editingTask)} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
