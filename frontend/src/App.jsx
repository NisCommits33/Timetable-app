/// App.jsx - Refactored
import { useState, useEffect } from "react";
import { Calendar, Plus, Sun, Moon, Target } from "lucide-react";

// Components
import AddTaskForm from "./components/AddTaskForm";
import WeekView from "./components/WeekView";
import DayView from "./components/DayView";
import ListView from "./components/ListView";
import TaskDetailModal from "./components/TaskDetailModal";
import CompletionModal from "./components/CompletionModal";
import FocusTimer from "./components/FocusTimer";
import NotificationCenter from "./components/NotificationCenter";
import ViewSwitcher from "./components/ViewSwitcher";
import EditTaskModal from "./components/EditTaskModal";
import Snackbar from "./components/Snackbar";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

// Contexts
import { NotificationProvider } from "./contexts/NotificationContext";
import { SnackbarProvider, useSnackbar } from "./contexts/SnackbarContext";

// Custom Hooks
import { useTimeTracking } from "./hooks/useTimeTracking";
import { useTasks } from "./hooks/useTasks";
import { useModals } from "./hooks/useModals";

// Initial sample tasks
const initialTasks = [
  {
    id: 1,
    title: "Morning Run",
    description: "5k run around the park for morning exercise",
    startTime: "07:00",
    endTime: "08:00",
    date: "2025-08-28",
    day: "Monday",
    category: "fitness",
    priority: "medium",
    tags: ["exercise", "health", "morning-routine"],
    completed: false,
    completedAt: null,
    timeTracking: {
      isTracking: false,
      totalTimeSpent: 0,
      currentSessionStart: null,
      sessions: [],
    },
    estimatedDuration: 3600,
    actualDuration: 0,
    location: "Central Park",
    notes: "Bring water bottle and headphones. Stretch before running.",
    attachments: [],
    recurrence: null,
    createdAt: "2025-08-27T10:00:00Z",
    updatedAt: "2025-08-27T10:00:00Z",
  },
  {
    id: 2,
    title: "Team Meeting",
    description: "Weekly team sync and project updates",
    startTime: "10:00",
    endTime: "11:00",
    date: "2025-08-28",
    day: "Monday",
    category: "work",
    priority: "high",
    tags: ["meeting", "work", "collaboration"],
    completed: false,
    completedAt: null,
    timeTracking: {
      isTracking: false,
      totalTimeSpent: 0,
      currentSessionStart: null,
      sessions: [],
    },
    estimatedDuration: 3600,
    actualDuration: 0,
    location: "Conference Room A",
    notes: "Prepare project status slides. Discuss Q3 goals.",
    attachments: [],
    recurrence: null,
    createdAt: "2025-08-27T14:00:00Z",
    updatedAt: "2025-08-27T14:00:00Z",
  },
  {
    id: 3,
    title: "Lunch Break",
    description: "Lunch and relaxation time",
    startTime: "12:30",
    endTime: "13:30",
    date: "2025-08-28",
    day: "Monday",
    category: "personal",
    priority: "low",
    tags: ["break", "food", "relax"],
    completed: false,
    completedAt: null,
    timeTracking: {
      isTracking: false,
      totalTimeSpent: 0,
      currentSessionStart: null,
      sessions: [],
    },
    estimatedDuration: 3600,
    actualDuration: 0,
    location: "Office Cafeteria",
    notes: "Try the new salad bar option.",
    attachments: [],
    recurrence: null,
    createdAt: "2025-08-27T16:00:00Z",
    updatedAt: "2025-08-27T16:00:00Z",
  },
  {
    id: 4,
    title: "Study React Hooks",
    description: "Deep dive into advanced React hooks and patterns",
    startTime: "14:00",
    endTime: "16:00",
    date: "2025-08-29",
    day: "Tuesday",
    category: "learning",
    priority: "medium",
    tags: ["study", "programming", "react"],
    completed: false,
    completedAt: null,
    timeTracking: {
      isTracking: false,
      totalTimeSpent: 0,
      currentSessionStart: null,
      sessions: [],
    },
    estimatedDuration: 7200,
    actualDuration: 0,
    location: "Home Office",
    notes: "Focus on useReducer and custom hooks. Practice with examples.",
    attachments: [],
    recurrence: null,
    createdAt: "2025-08-28T09:00:00Z",
    updatedAt: "2025-08-28T09:00:00Z",
  },
  {
    id: 5,
    title: "Gym Workout",
    description: "Strength training and cardio session",
    startTime: "18:00",
    endTime: "19:30",
    date: "2025-08-29",
    day: "Tuesday",
    category: "fitness",
    priority: "medium",
    tags: ["exercise", "gym", "health"],
    completed: false,
    completedAt: null,
    timeTracking: {
      isTracking: false,
      totalTimeSpent: 0,
      currentSessionStart: null,
      sessions: [],
    },
    estimatedDuration: 5400,
    actualDuration: 0,
    location: "City Fitness Center",
    notes: "Leg day - squats, lunges, and 20min cardio.",
    attachments: [],
    recurrence: null,
    createdAt: "2025-08-28T11:00:00Z",
    updatedAt: "2025-08-28T11:00:00Z",
  },
];

// Main App Content Component (needs to be inside SnackbarProvider to use useSnackbar)
function AppContent() {
  // Custom hooks
  const {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    moveTask,
  } = useTasks(initialTasks);

  const {
    detailModal,
    editModal,
    completionModal,
    openDetailModal,
    closeDetailModal,
    openEditModal,
    closeEditModal,
    openCompletionModal,
    closeCompletionModal,
    transitionModal,
  } = useModals();

  const {
    activeTimer,
    startTracking,
    stopTracking,
    toggleTracking,
    addManualTime,
    resetTracking,
  } = useTimeTracking(tasks, setTasks);

  const { success, error, warning, info } = useSnackbar();

  // Local state
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState("week");
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [focusTask, setFocusTask] = useState(null);

  // Set initial theme based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  // Handle task addition
  const handleAddTask = (newTask) => {
    const result = addTask(newTask);
    if (result.success) {
      success("Task added successfully! 🎉");
    } else {
      error(result.error || "Failed to add task");
    }
  };

  // Handle task edit
  const handleEditTask = (task) => {
    openEditModal(task);
  };

  // Handle save edit
  const handleSaveEdit = (updatedTask) => {
    const result = updateTask(updatedTask.id, updatedTask);
    if (result.success) {
      success("Task updated successfully! ✓");
      closeEditModal();
    } else {
      error(result.error || "Failed to update task");
    }
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    success("Task deleted");
    closeDetailModal();
    closeEditModal();
  };

  // Handle task completion
  const handleCompleteTask = (taskId, completionData) => {
    updateTask(taskId, {
      completed: completionData.completed,
      completionType: completionData.completionType,
      remarks: completionData.remarks,
      completedAt: completionData.completedAt,
      timeSpent: completionData.timeSpent,
      satisfaction: completionData.satisfaction,
      actualDuration: completionData.actualDuration,
    });

    if (completionData.completed) {
      success(
        `Task completed! ${completionData.remarks ? "Remarks added." : ""}`
      );
    }
    closeCompletionModal();
  };

  // Quick toggle completion (opens modal for incomplete tasks)
  const quickToggleCompletion = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      openCompletionModal(task);
    } else {
      toggleCompletion(taskId);
    }
  };

  // Handle task move
  const handleTaskMove = ({ task, targetDay }) => {
    if (!targetDay || targetDay === task.day) return;

    const result = moveTask(task.id, targetDay);
    if (result.success) {
      info(`Moved to ${targetDay}`);
    } else {
      error(result.error || "Failed to move task");
    }
  };

  return (
    <NotificationProvider tasks={tasks}>
      <div
        className={`min-h-screen transition-colors duration-200 ${isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
          }`}
      >
        {/* Header */}
        <header
          className={`border-b transition-colors duration-200 ${isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-7 w-7 text-blue-600" />
                <h1 className="text-xl font-semibold">Timetable App</h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                <NotificationCenter isDarkMode={isDarkMode} />

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

                {/* Focus Timer Toggle */}
                <button
                  onClick={() => setShowFocusTimer(!showFocusTimer)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
                    } ${showFocusTimer ? "bg-blue-500 text-white" : ""}`}
                  title={
                    showFocusTimer ? "Hide Focus Timer" : "Show Focus Timer"
                  }
                >
                  <Target className="h-5 w-5" />
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 relative">
              {/* Add Task Form */}
              <div
                className={`p-5 rounded-xl border transition-colors duration-200 ${isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
                  }`}
              >
                <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
                <AddTaskForm onAddTask={handleAddTask} isDarkMode={isDarkMode} />
              </div>

              {/* Focus Timer */}
              {showFocusTimer && (
                <div className="sticky top-4" style={{ zIndex: 20 }}>
                  <FocusTimer
                    isDarkMode={isDarkMode}
                    onClose={() => setShowFocusTimer(false)}
                  />
                </div>
              )}
            </div>

            {/* Main Content - Views */}
            <div className="lg:col-span-3">
              <div
                className={`p-6 rounded-xl border transition-colors duration-200 ${isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
                  }`}
              >
                {/* View Switcher */}
                <ViewSwitcher
                  currentView={currentView}
                  onViewChange={setCurrentView}
                  isDarkMode={isDarkMode}
                />

                {/* View Content */}
                <div className="mt-6">
                  {currentView === "week" && (
                    <WeekView
                      tasks={tasks}
                      onDayClick={setSelectedDay}
                      selectedDay={selectedDay}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={handleEditTask}
                      onViewDetails={openDetailModal}
                      onTaskMove={handleTaskMove}
                      isDarkMode={isDarkMode}
                      onToggleTracking={toggleTracking}
                      onAddManualTime={addManualTime}
                      onResetTracking={resetTracking}
                      onToggleCompletion={quickToggleCompletion}
                      onOpenCompletionModal={openCompletionModal}
                      onStartFocus={(task) => {
                        setFocusTask(task);
                        setShowFocusTimer(true);
                      }}
                    />
                  )}

                  {currentView === "day" && (
                    <DayView
                      tasks={tasks}
                      selectedDay={selectedDay}
                      onTaskClick={openDetailModal}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      isDarkMode={isDarkMode}
                      onToggleTracking={toggleTracking}
                      onAddManualTime={addManualTime}
                      onResetTracking={resetTracking}
                      onToggleCompletion={quickToggleCompletion}
                      onOpenCompletionModal={openCompletionModal}
                      onStartFocus={(task) => {
                        setFocusTask(task);
                        setShowFocusTimer(true);
                      }}
                    />
                  )}

                  {currentView === "list" && (
                    <ListView
                      tasks={tasks}
                      onTaskClick={openDetailModal}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      isDarkMode={isDarkMode}
                      onToggleTracking={toggleTracking}
                      onToggleCompletion={quickToggleCompletion}
                      onOpenCompletionModal={openCompletionModal}
                      onStartFocus={(task) => {
                        setFocusTask(task);
                        setShowFocusTimer(true);
                      }}
                    />
                  )}

                  {currentView === "board" && (
                    <div className="text-center py-12 text-gray-500">
                      Board View - Coming Soon!
                    </div>
                  )}

                  {currentView === "timeline" && (
                    <div className="text-center py-12 text-gray-500">
                      Timeline View - Coming Soon!
                    </div>
                  )}

                  {currentView === "analytics" && (
                    <AnalyticsDashboard
                      tasks={tasks}
                      isDarkMode={isDarkMode}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <TaskDetailModal
          open={detailModal.isOpen}
          task={detailModal.task}
          onClose={closeDetailModal}
          onEdit={(task) => transitionModal("detail", "edit", task)}
          onDelete={handleDeleteTask}
          isDarkMode={isDarkMode}
        />

        <CompletionModal
          isOpen={completionModal.isOpen}
          onClose={closeCompletionModal}
          task={completionModal.task}
          onComplete={handleCompleteTask}
          isDarkMode={isDarkMode}
        />

        <EditTaskModal
          isOpen={editModal.isOpen}
          task={editModal.task}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
          isDarkMode={isDarkMode}
        />

        {/* Snackbar Notifications */}
        <Snackbar />
      </div>
    </NotificationProvider>
  );
}

// Main App Component with Providers
function App() {
  return (
    <SnackbarProvider>
      <AppContent />
    </SnackbarProvider>
  );
}

export default App;
