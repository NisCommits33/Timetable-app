export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  OVERDUE: 'overdue', 
  PROGRESS: 'progress',
  SCHEDULE: 'schedule'
};

export const REMINDER_TIMINGS = {
  FIVE_MIN: 5,
  FIFTEEN_MIN: 15,
  THIRTY_MIN: 30
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