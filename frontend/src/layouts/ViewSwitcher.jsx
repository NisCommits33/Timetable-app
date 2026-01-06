import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const ViewSwitcher = ({ isDarkMode }) => {
  const views = [
    { id: 'week', label: 'Week' },
    { id: 'day', label: 'Day' },
    { id: 'list', label: 'List' },
    { id: 'board', label: 'Board' },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div className="flex p-1.5 rounded-2xl bg-surface-100/50 dark:bg-surface-800/50 border border-black/5 dark:border-white/5 backdrop-blur-sm relative">
      {views.map((view) => (
        <NavLink
          key={view.id}
          to={`/schedule/${view.id}`}
          className="relative px-6 py-2 z-10"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white dark:bg-surface-700 rounded-xl shadow-premium ring-1 ring-black/5 dark:ring-white/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-20 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${isActive
                  ? 'text-brand-600 dark:text-white'
                  : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
                }`}>
                {view.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default ViewSwitcher;