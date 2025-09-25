// components/TaskDetailModal.jsx
import { Fragment } from 'react';

/**
 * TaskDetailModal Component
 * 
 * Displays detailed information about a task in a modal dialog.
 * Features a clean, minimalist design using Tailwind CSS with full dark mode support.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls modal visibility
 * @param {Object} props.task - Task data object
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 */
function TaskDetailModal({ open, task, onClose, onEdit, onDelete }) {
  // Return null if no task is provided or modal is not open
  if (!open || !task) return null;

  /**
   * Determines the appropriate color classes based on priority level
   * @param {string} priority - Task priority ('high', 'medium', 'low')
   * @returns {string} Tailwind CSS classes for the priority indicator
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    // Modal backdrop with fade-in animation
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Modal container with scale animation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-scaleIn">
        {/* Modal header with title and close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{task.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Priority and Category badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
              {task.category}
            </span>
          </div>

          {/* Task description */}
          {task.description && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
            </div>
          )}

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          {/* Time information */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {task.startTime} - {task.endTime} • {task.day}
            </span>
          </div>

          {/* Location information */}
          {task.location && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">{task.location}</span>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tags:</p>
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes section */}
          {task.notes && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.notes}</p>
              </div>
            </div>
          )}

          {/* Creation date */}
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Modal actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(task)}
            className="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;