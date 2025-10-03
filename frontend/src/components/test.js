// Add this function to check progress in real-time
const checkProgressNotifications = () => {
  if (!settings.enabled) return;

  tasks.forEach(task => {
    if (task.completed || !task.timeTracking.isTracking) return;

    const timeSpent = calculateCurrentTimeSpent(task.timeTracking);
    const timeSpentSeconds = Math.floor(timeSpent / 1000);
    const estimatedSeconds = task.estimatedDuration;

    if (!estimatedSeconds || estimatedSeconds === 0) return;

    const completionPercent = (timeSpentSeconds / estimatedSeconds) * 100;
    
    // Progress notification every 25%
    const progressMilestone = Math.floor(completionPercent / 25) * 25;
    if (progressMilestone > 0 && progressMilestone <= 100) {
      const existingProgress = notifications.find(
        n => n.taskId === task.id && 
             n.type === NOTIFICATION_TYPES.PROGRESS &&
             n.message.includes(`${progressMilestone}%`) &&
             Date.now() - n.timestamp < 60000 // Within last minute
      );

      if (!existingProgress) {
        addNotification({
          id: Date.now() + Math.random(),
          type: NOTIFICATION_TYPES.PROGRESS,
          taskId: task.id,
          taskTitle: task.title,
          message: NOTIFICATION_MESSAGES.progress(task, progressMilestone),
          timestamp: Date.now(),
          read: false
        });
      }
    }
  });
};

// Add this to your existing interval check
useEffect(() => {
  const interval = setInterval(() => {
    checkUpcomingTasks();
    checkProgressNotifications(); // ADD THIS LINE
    
    // Send daily summary at 8 AM
    const now = new Date();
    if (now.getHours() === 8 && now.getMinutes() === 0) {
      sendDailySummary();
    }
  }, 60000); // 1 minute
  
  checkUpcomingTasks();
  checkProgressNotifications(); // Initial check
  
  return () => clearInterval(interval);
}, [tasks, settings, notifications.length]);