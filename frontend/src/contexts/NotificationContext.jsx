import React, { createContext, useContext, useState, useEffect } from 'react';
import { NOTIFICATION_TYPES, NOTIFICATION_MESSAGES, REMINDER_TIMINGS } from '../utils/notificationTypes';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, tasks = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notification-settings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      reminderTiming: REMINDER_TIMINGS.FIFTEEN_MIN,
      soundEnabled: true,
      pushEnabled: true,
      breakReminders: true,
      dailySummary: true,
      quietHours: { enabled: false, start: '22:00', end: '07:00' },
      // ADD THESE NEW SETTINGS:
      reminderFrequency: 'once', // 'once', '5min', '10min', 'until_start'
      overdueFrequency: '5min', // 'once', '5min', '10min', 'until_done'
      showInProgressOverdue: false, // Whether to show overdue when timer is running
      maxRemindersPerTask: 3 // Maximum number of reminders per task
    };
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Check if we're in quiet hours
  const isQuietHours = () => {
    if (!settings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = settings.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return currentTime >= startTime || currentTime < endTime;
  };

  // Add a new notification
  const addNotification = (notification) => {
    if (isQuietHours() && notification.type !== NOTIFICATION_TYPES.OVERDUE) {
      return; // Don't send notifications during quiet hours (except overdue)
    }
    
    setNotifications(prev => [notification, ...prev].slice(0, 50));
    
    // Show browser notification if enabled
    if (settings.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.taskTitle || 'Timetable App', {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
    
    // Play sound if enabled
    if (settings.soundEnabled) {
      playNotificationSound();
    }
  };

  // Simple notification sound using Web Audio API
  const playNotificationSound = () => {
    if (!settings.soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
    } catch (error) {
      console.log('Audio context not supported:', error);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Calculate current time spent for active tracking
  const calculateCurrentTimeSpent = (timeTracking) => {
    if (!timeTracking.isTracking) return timeTracking.totalTimeSpent;
    return timeTracking.totalTimeSpent + (Date.now() - timeTracking.currentSessionStart);
  };

  // Get current day name
  const getCurrentDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Helper function to determine if notification should be sent based on frequency
 // Replace the shouldSendNotification function with this:
const shouldSendNotification = (taskId, type, frequency) => {
  const now = Date.now();
  
  // Get all notifications of this type for this task
  const taskNotifications = notifications.filter(
    n => n.taskId === taskId && n.type === type
  );

  if (taskNotifications.length === 0) {
    return true; // No notifications yet, send first one
  }

  // Get the most recent notification of this type
  const lastNotification = taskNotifications[0]; // Notifications are sorted newest first
  
  switch (frequency) {
    case 'once':
      return false; // Only send once, already sent
      
    case '5min':
      // Send every 5 minutes
      return now - lastNotification.timestamp >= 5 * 60 * 1000;
      
    case '10min':
      // Send every 10 minutes  
      return now - lastNotification.timestamp >= 10 * 60 * 1000;
      
    case 'until_start':
    case 'until_done':
      // Send every 5 minutes for "until" modes
      return now - lastNotification.timestamp >= 5 * 60 * 1000;
      
    default:
      return true;
  }
};

  // Check for upcoming tasks and create reminders
  const checkUpcomingTasks = () => {
    if (!settings.enabled || tasks.length === 0) return;

    const now = new Date();
    const today = getCurrentDayName();
    let hasActiveTask = false;

    tasks.forEach(task => {
      if (task.completed) return;

      // ONLY check tasks for TODAY
      if (task.day !== today) return;

      const taskTime = new Date();
      const [hours, minutes] = task.startTime.split(':').map(Number);
      taskTime.setHours(hours, minutes, 0, 0);

      const timeDiff = (taskTime - now) / (1000 * 60); // difference in minutes

      // Check if task is active (within its time range)
      const taskEndTime = new Date(taskTime);
      const [endHours, endMinutes] = task.endTime.split(':').map(Number);
      taskEndTime.setHours(endHours, endMinutes, 0, 0);
      
      if (now >= taskTime && now <= taskEndTime) {
        hasActiveTask = true;
      }

      // Count existing reminders for this task
      const taskReminders = notifications.filter(
        n => n.taskId === task.id && 
             (n.type === NOTIFICATION_TYPES.REMINDER || n.type === NOTIFICATION_TYPES.OVERDUE) &&
             !n.read
      );

      // Check if we've reached max reminders
      const reachedMaxReminders = taskReminders.length >= settings.maxRemindersPerTask;

      // REMINDER LOGIC
      if (timeDiff > 0 && timeDiff <= settings.reminderTiming && !reachedMaxReminders) {
        const shouldSendReminder = shouldSendNotification(
          task.id,
          NOTIFICATION_TYPES.REMINDER,
          settings.reminderFrequency
        );

        if (shouldSendReminder) {
          addNotification({
            id: Date.now() + Math.random(),
            type: NOTIFICATION_TYPES.REMINDER,
            taskId: task.id,
            taskTitle: task.title,
            message: NOTIFICATION_MESSAGES.reminder(task, Math.round(timeDiff)),
            timestamp: Date.now(),
            read: false
          });
        }
      }

      // OVERDUE LOGIC
      const shouldShowOverdue = settings.showInProgressOverdue || !task.timeTracking?.isTracking;
      
      if (timeDiff < -5 && timeDiff > -60 && shouldShowOverdue && !reachedMaxReminders) {
        const shouldSendOverdue = shouldSendNotification(
          task.id,
          NOTIFICATION_TYPES.OVERDUE,
          settings.overdueFrequency
        );

        if (shouldSendOverdue) {
          addNotification({
            id: Date.now() + Math.random(),
            type: NOTIFICATION_TYPES.OVERDUE,
            taskId: task.id,
            taskTitle: task.title,
            message: NOTIFICATION_MESSAGES.overdue(task, Math.abs(Math.round(timeDiff))),
            timestamp: Date.now(),
            read: false
          });
        }
      }
    });

    // Break reminder (every 50 minutes of continuous work)
    if (settings.breakReminders && hasActiveTask) {
      const lastBreakNotification = notifications.find(
        n => n.type === NOTIFICATION_TYPES.BREAK && Date.now() - n.timestamp < 50 * 60 * 1000
      );

      if (!lastBreakNotification) {
        const activeTasks = tasks.filter(task => {
          if (task.completed) return false;
          const taskTime = new Date();
          const [hours, minutes] = task.startTime.split(':').map(Number);
          taskTime.setHours(hours, minutes, 0, 0);
          const taskEndTime = new Date(taskTime);
          const [endHours, endMinutes] = task.endTime.split(':').map(Number);
          taskEndTime.setHours(endHours, endMinutes, 0, 0);
          return now >= taskTime && now <= taskEndTime;
        });

        if (activeTasks.length > 0) {
          addNotification({
            id: Date.now() + Math.random(),
            type: NOTIFICATION_TYPES.BREAK,
            message: NOTIFICATION_MESSAGES.break(),
            timestamp: Date.now(),
            read: false
          });
        }
      }
    }
  };

  // Check for progress notifications during active time tracking
  const checkProgressNotifications = () => {
    if (!settings.enabled || tasks.length === 0) return;

    tasks.forEach(task => {
      if (task.completed || !task.timeTracking?.isTracking) return;

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
               n.message?.includes(`${progressMilestone}%`) &&
               Date.now() - n.timestamp < 60000
        );

        if (!existingProgress && progressMilestone % 25 === 0) {
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

  // Send daily schedule summary
  const sendDailySummary = () => {
    if (!settings.dailySummary) return;

    const today = getCurrentDayName();
    const todaysTasks = tasks.filter(task => task.day === today && !task.completed);
    
    if (todaysTasks.length > 0) {
      const existingSummary = notifications.find(
        n => n.type === NOTIFICATION_TYPES.SCHEDULE && 
             new Date(n.timestamp).toDateString() === new Date().toDateString()
      );

      if (!existingSummary) {
        addNotification({
          id: Date.now() + Math.random(),
          type: NOTIFICATION_TYPES.SCHEDULE,
          message: NOTIFICATION_MESSAGES.schedule(todaysTasks.length),
          timestamp: Date.now(),
          read: false
        });
      }
    }
  };

  // Check every minute for notifications
  useEffect(() => {
    const interval = setInterval(() => {
      checkUpcomingTasks();
      checkProgressNotifications();
      
      // Send daily summary at 8 AM
      const now = new Date();
      if (now.getHours() === 8 && now.getMinutes() === 0) {
        sendDailySummary();
      }
    }, 60000);
    
    checkUpcomingTasks();
    checkProgressNotifications();
    
    return () => clearInterval(interval);
  }, [tasks, settings, notifications.length]);

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    settings,
    setSettings,
    isQuietHours
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};