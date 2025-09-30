// components/SortableTaskItem.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";

/**
 * Sortable version of TaskItem with drag handles
 */
export function SortableTaskItem({
  task,
  onDelete,
  onEdit,
  onViewDetails,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
      day: task.day,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${
        isDragging ? "z-50" : ""
      }`}
    >
      <TaskItem
        task={task}
        onDelete={onDelete}
        onEdit={onEdit}
        onViewDetails={onViewDetails}
        isDarkMode={isDarkMode}
        onToggleTracking={onToggleTracking}
        onAddManualTime={onAddManualTime}
        onResetTracking={onResetTracking}
      />
    </div>
  );
}
