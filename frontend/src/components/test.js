function TaskItem({
  task,
  onDelete,
  onEdit,
  onViewDetails,
  isDarkMode,
  onToggleTracking,
  onAddManualTime,
  onResetTracking,
}) {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTimeControls, setShowTimeControls] = useState(false);
  const [manualTimeInput, setManualTimeInput] = useState("15");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showTimerSection, setShowTimerSection] = useState(false); // ADD THIS STATE

  // Real-time updates when tracking is active
  useEffect(() => {
    let interval;
    if (task.timeTracking.isTracking) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task.timeTracking.isTracking]);

  // ... rest of your existing code ...

  return (
    <div 
      className={`relative rounded-lg transition-all duration-300 cursor-pointer group overflow-hidden ${
        priorityTheme.cardBorder
      } ${priorityTheme.cardBg} ${priorityTheme.cardHover}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
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

              {/* TIMER TOGGLE BUTTON - ADD THIS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTimerSection(!showTimerSection);
                }}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  showTimerSection 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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

        {/* TIMER SECTION - CONDITIONAL RENDERING */}
        {showTimerSection && (
          <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            {/* Timer Control Button */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleTracking(task.id); 
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  task.timeTracking.isTracking
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
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
              <div className={`text-sm font-mono font-bold ${
                task.timeTracking.isTracking 
                  ? 'text-green-600 dark:text-green-400 animate-pulse' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {formatTimeShort(Math.floor(currentTimeSpent / 1000))}
              </div>
            </div>

            {/* Progress Bar */}
            {task.estimatedDuration > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (currentTimeSpent / 1000 / task.estimatedDuration) * 100)}%` 
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
                  onClick={(e) => { e.stopPropagation(); setShowTimeControls(!showTimeControls); }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showTimeControls ? 'Cancel' : 'Add Time'}
                </button>
                
                {currentTimeSpent > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onResetTracking(task.id); }}
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
                  <span className="text-xs text-gray-600 dark:text-gray-400">Add:</span>
                  <input
                    type="number"
                    value={manualTimeInput}
                    onChange={(e) => setManualTimeInput(e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs"
                    min="1"
                    max="480"
                    placeholder="15"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">minutes</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddManualTime(); }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Debug Info - Optional */}
            <div className="text-xs text-gray-500 bg-yellow-100 dark:bg-yellow-900 p-1 mt-2 rounded text-center">
              Debug: 
              Estimated: {task.estimatedDuration}s | 
              Spent: {Math.floor(currentTimeSpent/1000)}s |
              Progress: {Math.round((currentTimeSpent/1000/task.estimatedDuration)*100)}%
            </div>
          </div>
        )}

        {/* Rest of your existing code for expandable details */}
        {/* ... */}
      </div>
    </div>
  );
}