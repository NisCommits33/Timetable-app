// components/TaskItem.jsx
import { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  AlertCircle, 
  FileText, 
  Tag,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * TaskItem Component - Enhanced task card with priority colors and expandable details
 * @param {Object} props - Component properties
 * @param {Object} props.task - The task object to display
 * @param {Function} props.onDelete - Callback to delete this task
 * @param {Function} props.onEdit - Callback to edit this task
 * @param {Function} props.onViewDetails - Callback to view task details
 * @param {boolean} props.isDarkMode - Current theme mode for styling
 */
function TaskItem({ task, onDelete, onEdit, onViewDetails, isDarkMode }) {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Gets comprehensive color scheme based on task priority
   * @returns {Object} - Complete color configuration for the priority
   */
  const getPriorityTheme = () => {
    const themes = {
      high: {
        // Main card colors
        cardBorder: 'border-l-4 border-l-red-500',
        cardBg: 'bg-red-50 dark:bg-red-900/10',
        cardHover: 'hover:bg-red-100 dark:hover:bg-red-900/20',
        
        // Text and icon colors
        title: 'text-red-900 dark:text-red-100',
        text: 'text-red-800/80 dark:text-red-200/80',
        icon: 'text-red-600 dark:text-red-400',
        
        // Badge colors
        badgeBg: 'bg-red-100 dark:bg-red-900/30',
        badgeText: 'text-red-800 dark:text-red-200',
        badgeBorder: 'border-red-200 dark:border-red-700',
        
        // Priority indicator
        indicator: 'bg-red-500',
        indicatorGlow: 'shadow-lg shadow-red-500/25'
      },
      medium: {
        cardBorder: 'border-l-4 border-l-yellow-500',
        cardBg: 'bg-yellow-50 dark:bg-yellow-900/10',
        cardHover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/20',
        title: 'text-yellow-900 dark:text-yellow-100',
        text: 'text-yellow-800/80 dark:text-yellow-200/80',
        icon: 'text-yellow-600 dark:text-yellow-400',
        badgeBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        badgeText: 'text-yellow-800 dark:text-yellow-200',
        badgeBorder: 'border-yellow-200 dark:border-yellow-700',
        indicator: 'bg-yellow-500',
        indicatorGlow: 'shadow-lg shadow-yellow-500/25'
      },
      low: {
        cardBorder: 'border-l-4 border-l-green-500',
        cardBg: 'bg-green-50 dark:bg-green-900/10',
        cardHover: 'hover:bg-green-100 dark:hover:bg-green-900/20',
        title: 'text-green-900 dark:text-green-100',
        text: 'text-green-800/80 dark:text-green-200/80',
        icon: 'text-green-600 dark:text-green-400',
        badgeBg: 'bg-green-100 dark:bg-green-900/30',
        badgeText: 'text-green-800 dark:text-green-200',
        badgeBorder: 'border-green-200 dark:border-green-700',
        indicator: 'bg-green-500',
        indicatorGlow: 'shadow-lg shadow-green-500/25'
      }
    };
    
    return themes[task.priority] || themes.medium;
  };

  /**
   * Toggles expanded view for more details
   */
  const toggleExpanded = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const priorityTheme = getPriorityTheme();

  return (
    <div 
      className={`relative rounded-lg transition-all duration-300 cursor-pointer group overflow-hidden ${
        priorityTheme.cardBorder
      } ${priorityTheme.cardBg} ${priorityTheme.cardHover}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onViewDetails(task)}
    >
      {/* Priority Indicator Dot */}
      <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${priorityTheme.indicator} ${priorityTheme.indicatorGlow}`} />
      
      <div className="pl-6 pr-3 py-3">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            {/* Title and Priority */}
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold text-sm truncate ${priorityTheme.title}`}>
                {task.title}
              </h3>
              
              {/* Priority Badge */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityTheme.badgeBg} ${priorityTheme.badgeText} ${priorityTheme.badgeBorder}`}>
                <AlertCircle className="h-3 w-3 mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            {/* Time and Day */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center">
                <Clock className={`h-3 w-3 mr-1 ${priorityTheme.icon}`} />
                <span className={priorityTheme.text}>
                  {task.startTime} - {task.endTime}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className={`h-3 w-3 mr-1 ${priorityTheme.icon}`} />
                <span className={priorityTheme.text}>
                  {task.day}
                </span>
              </div>
              
              <span className={priorityTheme.text}>
                {calculateDuration(task.startTime, task.endTime)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex space-x-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(task); }}
                className={`p-1.5 rounded-full transition-colors ${priorityTheme.badgeBg} hover:opacity-80`}
                title="View details"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className={`p-1.5 rounded-full transition-colors ${priorityTheme.badgeBg} hover:opacity-80`}
                title="Edit task"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className={`p-1.5 rounded-full transition-colors bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:opacity-80`}
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Description - Always visible if available */}
        {task.description && (
          <p className={`text-xs mb-2 leading-relaxed ${priorityTheme.text}`}>
            {task.description}
          </p>
        )}

        {/* Expandable Details Section */}
        {(task.location || task.notes || task.tags?.length > 0) && (
          <div className="mt-2">
            {/* Expand/Collapse Button */}
            <button
              onClick={toggleExpanded}
              className={`flex items-center text-xs font-medium ${priorityTheme.text} hover:opacity-70 transition-opacity`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show details
                </>
              )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-2 space-y-2 animate-fadeIn">
                {/* Location */}
                {task.location && (
                  <div className="flex items-start text-xs">
                    <MapPin className={`h-3 w-3 mr-1.5 mt-0.5 ${priorityTheme.icon}`} />
                    <span className={priorityTheme.text}>
                      <strong>Location:</strong> {task.location}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {task.notes && (
                  <div className="flex items-start text-xs">
                    <FileText className={`h-3 w-3 mr-1.5 mt-0.5 ${priorityTheme.icon}`} />
                    <span className={priorityTheme.text}>
                      <strong>Notes:</strong> {task.notes}
                    </span>
                  </div>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-start text-xs">
                    <Tag className={`h-3 w-3 mr-1.5 mt-0.5 ${priorityTheme.icon}`} />
                    <div className="flex flex-wrap gap-1">
                      <span className={`font-medium ${priorityTheme.text}`}>Tags:</span>
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-0.5 rounded-full ${priorityTheme.badgeBg} ${priorityTheme.badgeText} ${priorityTheme.badgeBorder}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center space-x-4 text-xs pt-2 border-t border-current border-opacity-20">
                  <span className={priorityTheme.text}>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  {task.category && (
                    <span className={`px-2 py-0.5 rounded ${priorityTheme.badgeBg} ${priorityTheme.badgeText}`}>
                      {task.category}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compact view when not expanded */}
        {!isExpanded && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-current border-opacity-20">
            {/* Quick info preview */}
            <div className="flex items-center space-x-3 text-xs">
              {task.location && (
                <div className="flex items-center">
                  <MapPin className={`h-3 w-3 mr-1 ${priorityTheme.icon}`} />
                  <span className={priorityTheme.text}>
                    {task.location.split(',')[0]} {/* Show only first part of location */}
                  </span>
                </div>
              )}
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag className={`h-3 w-3 mr-1 ${priorityTheme.icon}`} />
                  <span className={priorityTheme.text}>
                    {task.tags.length} tag{task.tags.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Expand hint */}
            {(task.location || task.notes || task.tags?.length > 0) && (
              <ChevronDown className={`h-3 w-3 ${priorityTheme.icon} opacity-60`} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Calculates duration between two times
 */
const calculateDuration = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  const duration = endTotal - startTotal;
  
  if (duration <= 0) return '0m';
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default TaskItem;