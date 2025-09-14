// App.jsx
import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Paper,
  Box,
  Chip
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon, 
  Add as AddIcon 
} from '@mui/icons-material';
import AddTaskForm from './components/AddTaskForm';
import WeekView from './components/WeekView';

const initialTasks = [
  {
    id: 1,
    title: "Morning Freshness",
    startTime: "7:00",
    endTime: "7:30",
    date: "2025/08/28",
    day: "Monday"
  },
  {
    id: 2,
    title: "Morning Walk",
    startTime: "7:30",
    endTime: "8:00",
    date: "2025/08/28",
    day: "Monday"
  },
  {
    id: 3,
    title: "Reading Time",
    startTime: "8:00",
    endTime: "9:00",
    date: "2025/08/28",
    day: "Tuesday"
  }
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDayClick = (clickedDay) => {
    setSelectedDay(clickedDay);
  };

  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const deleteTask = (taskIdToDelete) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskIdToDelete));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        className="bg-white border-b border-gray-200"
      >
        <Toolbar className="flex justify-between">
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

      {/* Main Content */}
      <Container maxWidth="xl" className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Add Task Form */}
          <div className="lg:col-span-1">
            <Paper 
              elevation={0}
              className="p-6 rounded-2xl border border-gray-200 sticky top-8"
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

          {/* Main Content - Week View */}
          <div className="lg:col-span-2">
            <Paper 
              elevation={0}
              className="p-6 rounded-2xl border border-gray-200"
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
              
              <WeekView 
                tasks={tasks} 
                onDayClick={handleDayClick} 
                selectedDay={selectedDay}
                onDeleteTask={deleteTask}
              />
            </Paper>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;