import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";
import { motion } from "framer-motion";

export function SortableTaskItem({
  task,
  onDelete,
  onEdit,
  onViewDetails,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
  onToggleCompletion,
  onOpenCompletionModal,
  onStartFocus
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
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group ${isDragging ? "z-50 scale-105" : ""}`}
    >
      <motion.div
        animate={isDragging ? { scale: 1.02, rotate: 1 } : { scale: 1, rotate: 0 }}
        className="touch-none"
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
          onToggleCompletion={onToggleCompletion}
          onOpenCompletionModal={onOpenCompletionModal}
          onStartFocus={onStartFocus}
        />
      </motion.div>
    </div>
  );
}
