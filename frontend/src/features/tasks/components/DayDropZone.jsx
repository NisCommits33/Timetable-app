import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, Target } from 'lucide-react';

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
      className={`relative min-h-[100px] rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center p-4 ${isOver
          ? 'border-brand-500 bg-brand-500/10 scale-[1.02] shadow-lg shadow-brand-500/10'
          : 'border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/20 opacity-40 hover:opacity-100 hover:border-surface-300'
        }`}
    >
      <div className={`flex flex-col items-center gap-2 transition-transform duration-300 ${isOver ? 'scale-110' : ''}`}>
        {isOver ? (
          <>
            <div className="p-2 rounded-full bg-brand-500 text-white animate-bounce">
              <Target size={20} />
            </div>
            <div className="text-center">
              <div className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">Release to Move</div>
              <div className="text-[10px] font-bold text-brand-500 opacity-70">Assigning to {day}</div>
            </div>
          </>
        ) : (
          <>
            <Plus size={24} className="text-surface-400" />
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-surface-500">Drop Target</div>
              <div className="text-[9px] font-bold text-surface-400 opacity-60">Move tasks to {day}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}