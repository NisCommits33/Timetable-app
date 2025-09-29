/// App.jsx
import { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Sun, Moon } from "lucide-react"; // Using Lucide for icons
import AddTaskForm from "./components/AddTaskForm";
import WeekView from "./components/WeekView";
import TaskDetailModal from "./components/TaskDetailModal";

// ... your initialTasks array remains the same ...
const initialTasks = [
  // Enhanced task object structure
  {
    id: 1,
    // Basic info
    title: "Morning Run",
    description: "5k run around the park", // NEW
    startTime: "07:00",
    endTime: "08:00",
    date: "2025-08-28",
    day: "Monday",

    // Categorization
    category: "fitness",
    priority: "medium", // NEW: low, medium, high
    tags: ["exercise", "health", "morning-routine"],

    // Status & tracking
    completed: false,
    completedAt: null,
    timeSpent: 0, // NEW: actual time spent in minutes

    // Additional details
    location: "Central Park", // NEW
    notes: "Bring water bottle and headphones", // NEW
    attachments: [], // NEW: for future file uploads
    recurrence: null, // NEW: for future recurring tasks

    // Metadata
    createdAt: "2025-08-27T10:00:00Z", // NEW
    updatedAt: "2025-08-27T10:00:00Z", // NEW
  },
];
  /**
 * Custom hook for robust localStorage management with error handling
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if no stored value exists
 * @returns {[any, Function]} - State value and setter function
 */
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
function App() {

  // State management with custom localStorage hook
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  // State to track which day is selected in the week view
  const [tasks, setTasks] = useLocalStorage("timetable-tasks", initialTasks);// Usage in component
  const [selectedDay, setSelectedDay] = useState(null);  
  // State for editing functionality
  const [editingTask, setEditingTask] = useState(null); // Stores the task being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls edit modal visibility
  const [isDarkMode, setIsDarkMode] = useState(false);

   /**
   * Toggles between dark and light mode
   * Also updates the HTML class for Tailwind dark mode
   */
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Set initial theme based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  /**
   * Validates if a new task time conflicts with existing tasks
   * @param {Object} newTask - The task to validate
   * @param {number|null} editingId - ID of task being edited (skip conflict check with itself)
   * @returns {boolean} - True if no conflict, False if conflict exists
   */

  //function for task details
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };
  //validate time
  const validateTaskTime = (newTask, editingId = null) => {
    return !tasks.some((task) => {
      // Skip conflict check with the task we're currently editing
      if (task.id === editingId) return false;

      // Only check tasks on the same day (no cross-day conflicts)
      if (task.day !== newTask.day) return false;

      // Convert time strings to minutes for easier comparison
      // Example: "07:30" becomes 450 minutes (7*60 + 30)
      const toMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const newStart = toMinutes(newTask.startTime);
      const newEnd = toMinutes(newTask.endTime);
      const existingStart = toMinutes(task.startTime);
      const existingEnd = toMinutes(task.endTime);

      // Check for time overlap: new task starts before existing task ends
      // AND new task ends after existing task starts
      return newStart < existingEnd && newEnd > existingStart;
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
      alert("⏰ Time conflict! This time slot overlaps with an existing task.");
      return;
    }
    // Add task to state (which will trigger localStorage save via useEffect)
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  /**
   * Deletes a task from the schedule
   * @param {number} taskIdToDelete - ID of the task to delete
   */
  const deleteTask = (taskIdToDelete) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskIdToDelete)
    );
  };

  /**
   * Opens the edit modal for a task
   * @param {Object} task - The task to edit
   */
  const handleEditTask = (task) => {
    setEditingTask(task); // Store the task being edited
    setIsEditModalOpen(true); // Open the edit modal
  };

  /**
   * Saves the edited task after validation
   * @param {Object} updatedTask - The task with edits applied
   */
  const handleSaveEdit = (updatedTask) => {
    // Validate edited task (pass the ID to skip conflict with itself)
    if (!validateTaskTime(updatedTask, updatedTask.id)) {
      alert("⏰ Time conflict! This time slot overlaps with an existing task.");
      return;
    }

    // Update the task in the state array
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
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
      localStorage.setItem("timetable-tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [tasks]); // Dependency array: runs when 'tasks' changes
const handleTaskMove = ({ task, targetDay }) => {
  if (!targetDay || targetDay === task.day) return;

  // Create updated task with new day
  const updatedTask = {
    ...task,
    day: targetDay,
    updatedAt: new Date().toISOString()
  };

  // Validate time conflict for new position
  if (!validateTaskTime(updatedTask, task.id)) {
    alert('⏰ Time conflict! Cannot move task to this time slot.');
    return;
  }

  // Update tasks state
  setTasks(prevTasks => 
    prevTasks.map(t => t.id === task.id ? updatedTask : t)
  );
};
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Header Section */}
      <header className={`border-b transition-colors duration-200 ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl font-semibold">Timetable App</h1>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              {/* New Task Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Add Task Form */}
          <div className="lg:col-span-1">
            <div className={`p-5 rounded-xl border transition-colors duration-200 sticky top-1 ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-800' 
                : 'border-gray-200 bg-white'
            }`}>
              <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
              <AddTaskForm onAddTask={addTask} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Main Content - Week View */}
          <div className="lg:col-span-3">
            <div className={`p-6 rounded-xl border transition-colors duration-200 ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-800' 
                : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Weekly Schedule</h2>
                {selectedDay && (
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isDarkMode
                      ? 'bg-blue-900/20 text-blue-300'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    Viewing: {selectedDay}
                  </span>
                )}
              </div>
              
              <WeekView 
  tasks={tasks}
  onDayClick={handleDayClick}
  selectedDay={selectedDay}
  onDeleteTask={deleteTask}
  onEditTask={handleEditTask}
  onViewDetails={handleViewDetails}
  onTaskMove={handleTaskMove}  // NEW
  isDarkMode={isDarkMode}
/>
            </div>
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      <TaskDetailModal
        open={detailModalOpen}
        task={selectedTask}
        onClose={() => setDetailModalOpen(false)}
        onEdit={(task) => {
          setDetailModalOpen(false);
          handleEditTask(task);
        }}
        onDelete={(taskId) => {
          setDetailModalOpen(false);
          deleteTask(taskId);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Edit Task Modal */}
      {isEditModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-xl ${
            isDarkMode 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Edit className="h-5 w-5 mr-2 text-blue-600" />
                Edit Task
              </h3>
              <button
                onClick={handleCloseEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Task Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editingTask.startTime}
                    onChange={(e) => setEditingTask({ ...editingTask, startTime: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editingTask.endTime}
                    onChange={(e) => setEditingTask({ ...editingTask, endTime: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Day of Week
                </label>
                <select
                  value={editingTask.day}
                  onChange={(e) => setEditingTask({ ...editingTask, day: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  }`}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseEdit}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingTask)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
