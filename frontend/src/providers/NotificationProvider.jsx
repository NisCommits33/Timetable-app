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
  // Refs to hold latest state for interval
  const stateRef = React.useRef({ tasks, notifications, settings });

  useEffect(() => {
    stateRef.current = { tasks, notifications, settings };
  }, [tasks, notifications, settings]);

  // Check every minute for notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const { tasks, notifications, settings } = stateRef.current;

      // Helper to access latest state inside closures
      const currentTasks = tasks;
      const currentNotifications = notifications;
      const currentSettings = settings;

      // Re-define checks to use local variables instead of closure variables
      // (This requires passing them as arguments or moving checking logic inside this effect)
      // A cleaner way is to make the check functions accept data as arguments.

      // Since refactoring the whole file to pass arguments is large, we'll invoke the logic here directly 
      // or wrap the check functions to use the ref.

      // ACTUALLY: The easiest fix is to move the check functions INSIDE the effect or 
      // simply rely on the fact that we can call a mutable ref wrapper.

      // Let's call a stable wrapper function:
      runChecks();

    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Wrapper to run checks with latest state
  const runChecks = () => {
    const { tasks, notifications, settings } = stateRef.current;

    checkUpcomingTasks(tasks, notifications, settings);
    checkProgressNotifications(tasks, notifications, settings);
    checkDailySummary(tasks, notifications, settings);
  };

  // ----------------------------------------------------
  // LOGIC FUNCTIONS (Modified to accept arguments)
  // ----------------------------------------------------

  const checkUpcomingTasks = (tasksList, notifsList, settingsObj) => {
    if (!settingsObj.enabled || tasksList.length === 0) return;

    const now = new Date();
    const today = getCurrentDayName();

    tasksList.forEach(task => {
      if (task.completed) return;
      if (task.day !== today) return;

      const taskTime = new Date();
      const [hours, minutes] = task.startTime.split(':').map(Number);
      taskTime.setHours(hours, minutes, 0, 0);

      const timeDiff = (taskTime - now) / (1000 * 60);

      const taskReminders = notifsList.filter(
        n => n.taskId === task.id &&
          (n.type === NOTIFICATION_TYPES.REMINDER || n.type === NOTIFICATION_TYPES.OVERDUE) &&
          !n.read
      );
      const reachedMaxReminders = taskReminders.length >= settingsObj.maxRemindersPerTask;

      // Reminder Logic
      if (timeDiff > 0 && timeDiff <= settingsObj.reminderTiming && !reachedMaxReminders) {
        // Custom frequency check using current notifications list
        const shouldSend = shouldSendNotification(task.id, NOTIFICATION_TYPES.REMINDER, settingsObj.reminderFrequency, notifsList);

        if (shouldSend) {
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

      // Overdue Logic
      const shouldShowOverdue = settingsObj.showInProgressOverdue || !task.timeTracking?.isTracking;
      if (timeDiff < -5 && timeDiff > -60 && shouldShowOverdue && !reachedMaxReminders) {
        const shouldSend = shouldSendNotification(task.id, NOTIFICATION_TYPES.OVERDUE, settingsObj.overdueFrequency, notifsList);
        if (shouldSend) {
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
  };

  const checkProgressNotifications = (tasksList, notifsList, settingsObj) => {
    if (!settingsObj.enabled || tasksList.length === 0) return;

    tasksList.forEach(task => {
      if (task.completed || !task.timeTracking?.isTracking) return;

      const timeSpent = calculateCurrentTimeSpent(task.timeTracking); // This function is safe
      const timeSpentSeconds = Math.floor(timeSpent / 1000);
      const estimatedSeconds = task.estimatedDuration;

      if (!estimatedSeconds) return;

      const completionPercent = (timeSpentSeconds / estimatedSeconds) * 100;
      const progressMilestone = Math.floor(completionPercent / 25) * 25;

      if (progressMilestone === 0) return;

      const hasBeenNotified = notifsList.some(
        n => n.taskId === task.id && n.type === NOTIFICATION_TYPES.PROGRESS && n.milestone === progressMilestone
      );

      if (!hasBeenNotified && progressMilestone % 25 === 0) {
        addNotification({
          id: Date.now(),
          type: NOTIFICATION_TYPES.PROGRESS,
          taskId: task.id,
          taskTitle: task.title,
          milestone: progressMilestone,
          message: NOTIFICATION_MESSAGES.progress(task, progressMilestone),
          timestamp: Date.now(),
          read: false
        });
      }
    });
  };

  const checkDailySummary = (tasksList, notifsList, settingsObj) => {
    if (!settingsObj.dailySummary) return;

    const now = new Date();
    // Check if it's after 8 AM and before 10 PM
    if (now.getHours() >= 8 && now.getHours() < 22) {
      const today = getCurrentDayName();
      // Check if we already sent a summary today
      const alreadySent = notifsList.some(
        n => n.type === NOTIFICATION_TYPES.SCHEDULE &&
          new Date(n.timestamp).toDateString() === now.toDateString()
      );

      if (!alreadySent) {
        const todaysTasks = tasksList.filter(t => t.day === today && !t.completed);
        if (todaysTasks.length > 0) {
          addNotification({
            id: Date.now(),
            type: NOTIFICATION_TYPES.SCHEDULE,
            message: NOTIFICATION_MESSAGES.schedule(todaysTasks.length),
            timestamp: Date.now(),
            read: false
          });
        }
      }
    }
  };

  // Helper for frequency (needs list passed in)
  const shouldSendNotification = (taskId, type, frequency, currentNotifs) => {
    const now = Date.now();
    const taskNotifs = currentNotifs.filter(n => n.taskId === taskId && n.type === type);

    if (taskNotifs.length === 0) return true;

    const lastNotif = taskNotifs[0]; // Assuming newest first
    const diff = now - lastNotif.timestamp;

    if (frequency === 'once') return false;
    if (frequency === '5min' && diff >= 5 * 60000) return true;
    if (frequency === '10min' && diff >= 10 * 60000) return true;

    return false;
  };

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