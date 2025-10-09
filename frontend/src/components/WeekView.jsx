// components/WeekView.jsx
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { SortableTaskItem } from './SortableTaskItem';
import { DayDropZone } from './DayDropZone';
import TaskItem from './TaskItem';

/**
 * WeekView Component - Displays the weekly schedule grid with Drag & Drop functionality
 * 
 * A responsive grid layout showing tasks for each day of the week.
 * Features drag & drop functionality for task rescheduling between days.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.tasks - Array of task objects
 * @param {Function} props.onDayClick - Callback when a day is clicked
 * @param {string|null} props.selectedDay - Currently selected day
 * @param {Function} props.onDeleteTask - Callback to delete a task
 * @param {Function} props.onEditTask - Callback to edit a task
 * @param {Function} props.onViewDetails - Callback to view task details
 * @param {Function} props.onTaskMove - Callback when a task is moved via drag & drop
 * @param {boolean} props.isDarkMode - Current theme mode for styling
 */
export default function WeekView({ 
  tasks, 
  onDayClick, 
  selectedDay, 
  onDeleteTask, 
  onEditTask, 
  onViewDetails,
  onTaskMove,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
  onToggleCompletion,
  onOpenCompletionModal 
}) {
  // Array of days to display in the weekly view
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // State for drag overlay
  const [activeTask, setActiveTask] = useState(null);

  // Configure sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handles drag start - sets the active task being dragged
   */
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(active.data.current?.task);
  };

  /**
   * Handles drag end - processes the task movement
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = active.data.current?.task;
    const overTask = over.data.current?.task;
    const overDay = over.data.current?.day;

    if (!activeTask) return;

    // Determine target day (either from task or day drop zone)
    const targetDay = overDay || overTask?.day;
    
    if (targetDay && targetDay !== activeTask.day) {
      // Task moved to different day
      onTaskMove({
        task: activeTask,
        targetDay: targetDay,
        targetTaskId: overTask?.id,
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-4 p-2">
        {/* 
          Responsive grid layout:
          - Mobile (default): 1 column
          - sm (640px+): 2 columns  
          - md (768px+): 3 columns
          - lg (1024px+): 4 columns
          - xl (1280px+): 5 columns
          - 2xl (1536px+): 1 columns (all days in one row)
        */}
        
        {days.map(dayName => {
          // Filter tasks for the current day
          const tasksForToday = tasks.filter(task => task.day === dayName);
          
          return (
            <div
              key={dayName}
              onClick={() => onDayClick(dayName)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
                ${dayName === selectedDay
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 shadow-md' // Selected day styling
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500' // Default styling
                }`}
            >
              {/* Day Header Section */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {dayName}
                </h3>
                
                {/* Task count badge with conditional coloring */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tasksForToday.length > 0
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' // Has tasks - green
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'   // No tasks - gray
                }`}>
                  {tasksForToday.length} task{tasksForToday.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Tasks List Section with Drag & Drop */}
              <SortableContext 
                items={tasksForToday.map(t => t.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 min-h-[60px]">
                  {tasksForToday.length > 0 ? (
                    // Display sortable tasks if they exist
                    tasksForToday.map(task => (
                      <SortableTaskItem 
                        key={task.id} 
                        task={task} 
                        onDelete={onDeleteTask}
                        onEdit={onEditTask}
                        onViewDetails={onViewDetails}
                        isDarkMode={isDarkMode}
                        onToggleTracking={onToggleTracking}
                        onAddManualTime={onAddManualTime}
                        onResetTracking={onResetTracking}
                         onToggleCompletion={onToggleCompletion}        // ADD THIS
    onOpenCompletionModal={onOpenCompletionModal}

                        
                      />
                    ))
                  ) : (
                    // Display empty drop zone if no tasks
                    <DayDropZone day={dayName} isDarkMode={isDarkMode} />
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      {/* Drag Overlay - Shows the task being dragged */}
      <DragOverlay>
        {activeTask ? (
          <div className="transform rotate-3 shadow-2xl border-2 border-blue-500 rounded-lg opacity-90">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  activeTask.priority === 'high' ? 'bg-red-500' :
                  activeTask.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {activeTask.title}
                </h3>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-gray-400">
                <span>{activeTask.startTime} - {activeTask.endTime}</span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}