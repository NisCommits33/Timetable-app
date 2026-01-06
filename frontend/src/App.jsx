import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Layouts & Pages
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SchedulePage from "./pages/SchedulePage";
import FeaturesPage from "./pages/FeaturesPage";

// Components
import AddTaskModal from "./features/tasks/components/AddTaskModal";
import TaskDetailModal from "./features/tasks/components/TaskDetailModal";
import CompletionModal from "./features/tasks/components/CompletionModal";
import EditTaskModal from "./features/tasks/components/EditTaskModal";
import Snackbar from "./components/ui/Snackbar";

// Providers
import { NotificationProvider } from "./providers/NotificationProvider";
import { SnackbarProvider, useSnackbar } from "./providers/SnackbarProvider";

// Custom Hooks
import { useTimeTracking } from "./features/timer/hooks/useTimeTracking";
import { useTasks } from "./features/tasks/hooks/useTasks";
import { useModals } from "./features/tasks/hooks/useModals";

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
  }
];

function AppContent() {
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
    addTaskModal,
    openDetailModal,
    closeDetailModal,
    openEditModal,
    closeEditModal,
    openCompletionModal,
    closeCompletionModal,
    openAddTaskModal,
    closeAddTaskModal,
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
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [focusTask, setFocusTask] = useState(null);

  // Set initial theme based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const handleAddTask = (newTask) => {
    const result = addTask(newTask);
    if (result.success) success("Task added successfully! 🎉");
    else error(result.error || "Failed to add task");
  };

  const handleEditTask = (task) => openEditModal(task);

  const handleSaveEdit = (updatedTask) => {
    const result = updateTask(updatedTask.id, updatedTask);
    if (result.success) {
      success("Task updated successfully! ✓");
      closeEditModal();
    } else {
      error(result.error || "Failed to update task");
    }
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    success("Task deleted");
    closeDetailModal();
    closeEditModal();
  };

  const handleCompleteTask = (taskId, completionData) => {
    updateTask(taskId, {
      ...completionData
    });
    if (completionData.completed) success(`Task completed!`);
    closeCompletionModal();
  };

  const quickToggleCompletion = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) openCompletionModal(task);
    else toggleCompletion(taskId);
  };

  const handleTaskMove = ({ task, targetDay }) => {
    if (!targetDay || targetDay === task.day) return;
    const result = moveTask(task.id, targetDay);
    if (result.success) info(`Moved to ${targetDay}`);
    else error(result.error || "Failed to move task");
  };

  return (
    <NotificationProvider tasks={tasks}>
      <MainLayout
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        showFocusTimer={showFocusTimer}
        setShowFocusTimer={setShowFocusTimer}
      >
        <div className="min-h-[calc(100vh-200px)]">
          {/* Main Content Area - Full width now that sidebar is gone */}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard is now Analytics overview */}
            <Route path="/dashboard" element={
              <DashboardPage
                tasks={tasks}
                isDarkMode={isDarkMode}
                onAddTaskClick={() => openAddTaskModal()}
              />
            } />

            {/* Schedule hosts the task views */}
            <Route path="/schedule/*" element={
              <SchedulePage
                tasks={tasks}
                isDarkMode={isDarkMode}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                handleDeleteTask={handleDeleteTask}
                handleEditTask={handleEditTask}
                openDetailModal={openDetailModal}
                handleTaskMove={handleTaskMove}
                toggleTracking={toggleTracking}
                addManualTime={addManualTime}
                resetTracking={resetTracking}
                quickToggleCompletion={quickToggleCompletion}
                onOpenCompletionModal={openCompletionModal}
                setFocusTask={setFocusTask}
                setShowFocusTimer={setShowFocusTimer}
                onAddTaskClick={() => openAddTaskModal()}
              />
            } />

            <Route path="/features" element={<FeaturesPage isDarkMode={isDarkMode} />} />

            {/* Legacy or Direct Path Support */}
            <Route path="/week" element={<Navigate to="/schedule/week" replace />} />
            <Route path="/day" element={<Navigate to="/schedule/day" replace />} />
            <Route path="/list" element={<Navigate to="/schedule/list" replace />} />
            <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>

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

        <AddTaskModal
          isOpen={addTaskModal.isOpen}
          onClose={closeAddTaskModal}
          onAddTask={handleAddTask}
          isDarkMode={isDarkMode}
        />

        <Snackbar />
      </MainLayout>
    </NotificationProvider>
  );
}

function App() {
  return (
    <SnackbarProvider>
      <AppContent />
    </SnackbarProvider>
  );
}

export default App;
