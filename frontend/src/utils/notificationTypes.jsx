export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  OVERDUE: 'overdue', 
  PROGRESS: 'progress',
  SCHEDULE: 'schedule',
  COMPLETION: 'completion',
  BREAK: 'break',
  // ADD THESE NEW TYPES FOR TIME TRACKING:
  TIMER_START: 'timer_start',
  TIMER_STOP: 'timer_stop',
  TIME_MILESTONE: 'time_milestone',
  OVERTIME: 'overtime',
  GOAL_REACHED: 'goal_reached'
};


export const REMINDER_TIMINGS = {
  FIVE_MIN: 5,
  TEN_MIN: 10,
  FIFTEEN_MIN: 15,
  THIRTY_MIN: 30,
  ONE_HOUR: 60
};

export const createNotification = (type, task, data = {}) => ({
  id: Date.now() + Math.random(),
  type,
  taskId: task.id,
  taskTitle: task.title,
  timestamp: Date.now(),
  read: false,
  ...data
});

// Smart notification messages
export const NOTIFICATION_MESSAGES = {
  reminder: (task, minutes) => `"${task.title}" starts in ${minutes} minutes`,
  overdue: (task, minutes) => `"${task.title}" was scheduled to start ${minutes} minutes ago`,
  progress: (task, percent) => `"${task.title}" is ${percent}% complete - great work!`,
  schedule: (taskCount) => `You have ${taskCount} tasks scheduled for today`,
  completion: (task) => `Completed: "${task.title}" - ${formatTimeShort(task.actualDuration || 0)} spent`,
  break: () => `Time for a break! You've been working hard.`,
  // NEW TIME TRACKING MESSAGES:
  timer_start: (task) => `⏱️ Started tracking "${task.title}"`,
  timer_stop: (task, duration) => `⏹️ Stopped tracking "${task.title}" - ${formatTimeShort(duration)} spent`,
  time_milestone: (task, percent, timeSpent) => `🎯 "${task.title}" is ${percent}% complete (${formatTimeShort(timeSpent)})`,
  overtime: (task, overtime) => `⚠️ "${task.title}" is ${formatTimeShort(overtime)} over estimate`,
  goal_reached: (task) => `✅ "${task.title}" - Time goal reached!`
};

// Helper function for time formatting
const formatTimeShort = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};