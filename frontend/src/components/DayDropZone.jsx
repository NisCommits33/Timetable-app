// components/DayDropZone.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

/**
 * Drop zone for empty days
 */
export function DayDropZone({ day, isDarkMode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-drop-${day}`,
    data: {
      type: 'day',
      day: day,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center ${
        isOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : `border-gray-300 dark:border-gray-600 ${
              isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50'
            }`
      }`}
    >
      <div className={`text-center text-sm ${
        isOver 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-500 dark:text-gray-400'
      }`}>
        {isOver ? (
          <div>
            <div className="font-medium">Drop here</div>
            <div className="text-xs">Move task to {day}</div>
          </div>
        ) : (
          <div>
            <div className="font-medium">Drag tasks here</div>
            <div className="text-xs">or click to select</div>
          </div>
        )}
      </div>
    </div>
  );
}