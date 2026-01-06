// components/DndProvider.jsx
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

/**
 * Drag & Drop context provider for the entire app
 * Handles all drag and drop operations with proper sensors
 */
export function DndProvider({
  children,
  onTaskMove,
  activeTask,
  setActiveTask
}) {
  // Configure sensors for different input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drop animation configuration
  const dropAnimation = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
  };

  /**
   * Handles drag start - sets the active task being dragged
   */
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(active.data.current?.task);
  };

  /**
   * Handles drag end - moves the task to new position/day
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = active.data.current?.task;
    const overTask = over.data.current?.task;
    const overDay = over.data.current?.day;

    if (!activeTask) return;

    // Call the move callback with drag results
    onTaskMove({
      task: activeTask,
      targetDay: overDay || overTask?.day,
      targetTaskId: overTask?.id,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      
      {/* Drag overlay shows the task being dragged */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <TaskDragOverlay task={activeTask} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/**
 * Custom overlay component for dragged task
 */
function TaskDragOverlay({ task }) {
  return (
    <div className="transform rotate-3 shadow-2xl border-2 border-blue-500 opacity-90">
      {/* Use your existing TaskItem component with special styling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-l-4 border-l-blue-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <h3 className="font-medium text-sm text-blue-900 dark:text-blue-100">
            {task.title}
          </h3>
        </div>
        <div className="flex items-center mt-1 text-xs text-blue-700 dark:text-blue-300">
          <span>{task.startTime} - {task.endTime}</span>
        </div>
      </div>
    </div>
  );
}