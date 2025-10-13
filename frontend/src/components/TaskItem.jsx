// components/TaskItem.jsx
import { useState, useEffect } from "react";
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
  ChevronUp,
  Play,
  Square,
  Plus,
  Minus,
  Circle,
  CheckCircle,
  MessageCircle,
  Target
} from "lucide-react";
import { formatTime, formatTimeShort } from "../hooks/useTimeTracking";

/**
 * TaskItem Component - Enhanced task card with priority colors and expandable details
 * @param {Object} props - Component properties
 * @param {Object} props.task - The task object to display
 * @param {Function} props.onDelete - Callback to delete this task
 * @param {Function} props.onEdit - Callback to edit this task
 * @param {Function} props.onViewDetails - Callback to view task details
 * @param {boolean} props.isDarkMode - Current theme mode for styling
 */
function TaskItem({
  task,
  onDelete,
  onEdit,
  onViewDetails,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
  onToggleCompletion, // This should exist
  onOpenCompletionModal,
}) {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTimeControls, setShowTimeControls] = useState(false);
  const [manualTimeInput, setManualTimeInput] = useState("15");
  const [currentTime, setCurrentTime] = useState(Date.now()); // ADD THIS
  const [showTimerSection, setShowTimerSection] = useState(false);

  // Real-time updates when tracking is active
  useEffect(() => {
    let interval;
    if (task.timeTracking.isTracking) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000); // Update every second
    }
    return () => clearInterval(interval);
  }, [task.timeTracking.isTracking]);

  // Calculate current time if tracking is active - UPDATED
  const getCurrentTimeSpent = () => {
    if (task.timeTracking.isTracking) {
      const currentSessionTime =
        currentTime - task.timeTracking.currentSessionStart;
      return task.timeTracking.totalTimeSpent + currentSessionTime;
    }
    return task.timeTracking.totalTimeSpent;
  };

  const currentTimeSpent = getCurrentTimeSpent();
  /**
   * Gets comprehensive color scheme based on task priority
   * @returns {Object} - Complete color configuration for the priority
   */
  const getPriorityTheme = () => {
    const themes = {
      high: {
        cardBorder: task.completed
          ? "border-l-4 border-l-gray-400"
          : "border-l-4 border-l-red-500",
        cardBg: task.completed
          ? "bg-gray-100 dark:bg-gray-700/50"
          : "bg-red-50 dark:bg-red-900/10",
        cardHover: task.completed
          ? "hover:bg-gray-200 dark:hover:bg-gray-600/50"
          : "hover:bg-red-100 dark:hover:bg-red-900/20",
        title: task.completed
          ? "text-gray-500 dark:text-gray-400 line-through"
          : "text-red-900 dark:text-red-100",
        text: task.completed
          ? "text-gray-500 dark:text-gray-500"
          : "text-red-800/80 dark:text-red-200/80",
        icon: task.completed
          ? "text-gray-400 dark:text-gray-500"
          : "text-red-600 dark:text-red-400",
        badgeBg: task.completed
          ? "bg-gray-200 dark:bg-gray-600"
          : "bg-red-100 dark:bg-red-900/30",
        badgeText: task.completed
          ? "text-gray-600 dark:text-gray-400"
          : "text-red-800 dark:text-red-200",
        badgeBorder: task.completed
          ? "border-gray-300 dark:border-gray-500"
          : "border-red-200 dark:border-red-700",
        indicator: task.completed ? "bg-gray-400" : "bg-red-500",
        indicatorGlow: task.completed ? "" : "shadow-lg shadow-red-500/25",
      },
      medium: {
        cardBorder: task.completed
          ? "border-l-4 border-l-gray-400"
          : "border-l-4 border-l-yellow-500",
        cardBg: task.completed
          ? "bg-gray-100 dark:bg-gray-700/50"
          : "bg-yellow-50 dark:bg-yellow-900/10",
        cardHover: task.completed
          ? "hover:bg-gray-200 dark:hover:bg-gray-600/50"
          : "hover:bg-yellow-100 dark:hover:bg-yellow-900/20",
        title: task.completed
          ? "text-gray-500 dark:text-gray-400 line-through"
          : "text-yellow-900 dark:text-yellow-100",
        text: task.completed
          ? "text-gray-500 dark:text-gray-500"
          : "text-yellow-800/80 dark:text-yellow-200/80",
        icon: task.completed
          ? "text-gray-400 dark:text-gray-500"
          : "text-yellow-600 dark:text-yellow-400",
        badgeBg: task.completed
          ? "bg-gray-200 dark:bg-gray-600"
          : "bg-yellow-100 dark:bg-yellow-900/30",
        badgeText: task.completed
          ? "text-gray-600 dark:text-gray-400"
          : "text-yellow-800 dark:text-yellow-200",
        badgeBorder: task.completed
          ? "border-gray-300 dark:border-gray-500"
          : "border-yellow-200 dark:border-yellow-700",
        indicator: task.completed ? "bg-gray-400" : "bg-yellow-500",
        indicatorGlow: task.completed ? "" : "shadow-lg shadow-yellow-500/25",
      },
      low: {
        cardBorder: task.completed
          ? "border-l-4 border-l-gray-400"
          : "border-l-4 border-l-green-500",
        cardBg: task.completed
          ? "bg-gray-100 dark:bg-gray-700/50"
          : "bg-green-50 dark:bg-green-900/10",
        cardHover: task.completed
          ? "hover:bg-gray-200 dark:hover:bg-gray-600/50"
          : "hover:bg-green-100 dark:hover:bg-green-900/20",
        title: task.completed
          ? "text-gray-500 dark:text-gray-400 line-through"
          : "text-green-900 dark:text-green-100",
        text: task.completed
          ? "text-gray-500 dark:text-gray-500"
          : "text-green-800/80 dark:text-green-200/80",
        icon: task.completed
          ? "text-gray-400 dark:text-gray-500"
          : "text-green-600 dark:text-green-400",
        badgeBg: task.completed
          ? "bg-gray-200 dark:bg-gray-600"
          : "bg-green-100 dark:bg-green-900/30",
        badgeText: task.completed
          ? "text-gray-600 dark:text-gray-400"
          : "text-green-800 dark:text-green-200",
        badgeBorder: task.completed
          ? "border-gray-300 dark:border-gray-500"
          : "border-green-200 dark:border-green-700",
        indicator: task.completed ? "bg-gray-400" : "bg-green-500",
        indicatorGlow: task.completed ? "" : "shadow-lg shadow-green-500/25",
      },
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

  /**
   * Handles manual time addition
   */
  const handleAddManualTime = () => {
    const minutes = parseInt(manualTimeInput) || 0;
    if (minutes > 0) {
      onAddManualTime(task.id, minutes);
      setManualTimeInput("15");
      setShowTimeControls(false);
    }
  };
  /**
   * Handles completion toggle with modal for new completions
   */
  const handleCompletionToggle = (e) => {
    e.stopPropagation();

    if (task.completed) {
      // If already completed, just toggle back without modal
      if (onToggleCompletion) {
        onToggleCompletion(task.id);
      }
    } else {
      // If not completed, open completion modal
      if (onOpenCompletionModal) {
        onOpenCompletionModal(task);
      } else if (onToggleCompletion) {
        // Fallback to simple toggle if modal not available
        onToggleCompletion(task.id);
      }
    }
  };
  return (
    <div
      className={`relative rounded-lg transition-all duration-300 cursor-pointer group overflow-hidden ${priorityTheme.cardBorder} ${priorityTheme.cardBg} ${priorityTheme.cardHover}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onViewDetails(task)}
    >
      {/* Priority Indicator Dot */}
      <div
        className={`absolute top-3 left-3 w-3 h-3 rounded-full ${priorityTheme.indicator} ${priorityTheme.indicatorGlow}`}
      />

      <div className="pl-6 pr-3 py-3">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            {/* Title and Priority */}
            <div className="flex items-center space-x-2 mb-1">
              {/* // Update the completion checkbox to show different states */}
              <button
                onClick={handleCompletionToggle}
                className={`flex-shrink-0 mt-1 transition-all ${
                  task.completed
                    ? task.completionType === "cancelled"
                      ? "text-red-500 hover:text-red-600"
                      : task.completionType === "partially"
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-green-500 hover:text-green-600"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                }`}
                title={
                  task.completed
                    ? `Completed: ${task.completionType}`
                    : "Mark as complete"
                }
              >
                {task.completed ? (
                  task.completionType === "cancelled" ? (
                    <X className="h-4 w-4" />
                  ) : task.completionType === "partially" ? (
                    <CheckCircle className="h-4 w-4" fill="currentColor" />
                  ) : (
                    <CheckCircle className="h-4 w-4" fill="currentColor" />
                  )
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
              <h3
                className={`font-semibold text-sm truncate ${priorityTheme.title}`}
              >
                {task.title}
              </h3>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityTheme.badgeBg} ${priorityTheme.badgeText} ${priorityTheme.badgeBorder}`}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              {/* TIMER TOGGLE BUTTON - ADD THIS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTimerSection(!showTimerSection);
                }}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  showTimerSection
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                title={showTimerSection ? "Hide timer" : "Show timer"}
              >
                <Clock className="h-3 w-3" />
                <span>{showTimerSection ? "Hide" : "Timer"}</span>
              </button>
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
                <span className={priorityTheme.text}>{task.day}</span>
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
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(task);
                }}
                className={`p-1.5 rounded-full transition-colors ${priorityTheme.badgeBg} hover:opacity-80`}
                title="View details"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className={`p-1.5 rounded-full transition-colors ${priorityTheme.badgeBg} hover:opacity-80`}
                title="Edit task"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className={`p-1.5 rounded-full transition-colors bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:opacity-80`}
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              {/* Add Focus Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // This would need to be passed down from App.jsx
                  if (onStartFocus) {
                    onStartFocus(task);
                  }
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  isDarkMode
                    ? "bg-orange-900/30 text-orange-400 hover:bg-orange-800/30"
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                }`}
                title="Start focus session"
              >
                <Target className="h-3.5 w-3.5" />
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
                    <MapPin
                      className={`h-3 w-3 mr-1.5 mt-0.5 ${priorityTheme.icon}`}
                    />
                    <span className={priorityTheme.text}>
                      <strong>Location:</strong> {task.location}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {task.notes && (
                  <div className="flex items-start text-xs">
                    <FileText
                      className={`h-3 w-3 mr-1.5 mt-0.5 ${priorityTheme.icon}`}
                    />
                    <span className={priorityTheme.text}>
                      <strong>Notes:</strong> {task.notes}
                    </span>
                  </div>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-start text-xs">
                    <Tag
                      className={`h-3 w-3 mr-1.5 mt-0.5 ${priorityTheme.icon}`}
                    />
                    <div className="flex flex-wrap gap-1">
                      <span className={`font-medium ${priorityTheme.text}`}>
                        Tags:
                      </span>
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
                    <span
                      className={`px-2 py-0.5 rounded ${priorityTheme.badgeBg} ${priorityTheme.badgeText}`}
                    >
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
                    {task.location.split(",")[0]}{" "}
                    {/* Show only first part of location */}
                  </span>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag className={`h-3 w-3 mr-1 ${priorityTheme.icon}`} />
                  <span className={priorityTheme.text}>
                    {task.tags.length} tag{task.tags.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Expand hint */}
            {(task.location || task.notes || task.tags?.length > 0) && (
              <ChevronDown
                className={`h-3 w-3 ${priorityTheme.icon} opacity-60`}
              />
            )}
          </div>
        )}
        {/* Time Tracking Display */}
        {/* Add this debug section in your TaskItem return, before the timer section: */}
        {/* <div className="text-xs text-gray-500 bg-yellow-100 dark:bg-yellow-900 p-1 mb-2 rounded">
          Debug: Estimated: {task.estimatedDuration}s ={" "}
          {formatTimeShort(task.estimatedDuration)} | Spent:{" "}
          {Math.floor(currentTimeSpent / 1000)}s ={" "}
          {formatTimeShort(Math.floor(currentTimeSpent / 1000))} | Progress:{" "}
          {Math.round((currentTimeSpent / 1000 / task.estimatedDuration) * 100)}
          %
        </div> */}
        {/* // Add remarks display if task has remarks */}
        {task.remarks && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
            <div className="flex items-start space-x-2">
              <MessageCircle className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
              <span className="text-blue-700 dark:text-blue-300">
                {task.remarks}
              </span>
            </div>
          </div>
        )}

        {/* TIMER SECTION - CONDITIONAL RENDERING */}
        {showTimerSection && (
          <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            {/* Timer Control Button */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(
                    "Toggle tracking for task:",
                    task.id,
                    "Current state:",
                    task.timeTracking.isTracking
                  );
                  onToggleTracking(task.id);
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  task.timeTracking.isTracking
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30"
                }`}
              >
                {task.timeTracking.isTracking ? (
                  <>
                    <Square className="h-4 w-4" />
                    <span>Stop Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Start Timer</span>
                  </>
                )}
              </button>

              {/* Current Time Display */}
              <div
                className={`text-sm font-mono font-bold ${
                  task.timeTracking.isTracking
                    ? "text-green-600 dark:text-green-400 animate-pulse"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {formatTimeShort(Math.floor(currentTimeSpent / 1000))}
              </div>
            </div>

            {/* Progress Bar */}
            {task.estimatedDuration > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentTimeSpent / 1000 / task.estimatedDuration) * 100
                    )}%`,
                  }}
                />
              </div>
            )}

            {/* Manual Time Controls */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Estimated: {formatTimeShort(task.estimatedDuration)}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTimeControls(!showTimeControls);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showTimeControls ? "Cancel" : "Add Time"}
                </button>

                {currentTimeSpent > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetTracking(task.id);
                    }}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Manual Time Input */}
            {showTimeControls && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Add:
                  </span>
                  <input
                    type="number"
                    value={manualTimeInput}
                    onChange={(e) => setManualTimeInput(e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs"
                    min="1"
                    max="480"
                    placeholder="15"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    minutes
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddManualTime();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
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
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  const duration = endTotal - startTotal;

  if (duration <= 0) return "0m";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default TaskItem;
