import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, tasks = [] }) => { // Add default empty array
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    reminderTiming: 15, // minutes
    soundEnabled: true,
    pushEnabled: true
  });

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Check for upcoming tasks and create reminders
  const checkUpcomingTasks = () => {
    if (!settings.enabled || tasks.length === 0) return;

    const now = new Date();
    tasks.forEach(task => {
      const taskTime = new Date();
      const [hours, minutes] = task.startTime.split(':').map(Number);
      taskTime.setHours(hours, minutes, 0, 0);

      const timeDiff = (taskTime - now) / (1000 * 60); // difference in minutes

      // Create reminder if task is starting soon
      if (timeDiff > 0 && timeDiff <= settings.reminderTiming) {
        const existingReminder = notifications.find(
          n => n.taskId === task.id && n.type === 'reminder' && !n.read
        );

        if (!existingReminder) {
          const newNotification = {
            id: Date.now() + Math.random(),
            type: 'reminder',
            taskId: task.id,
            taskTitle: task.title,
            message: `"${task.title}" starts in ${Math.round(timeDiff)} minutes`,
            timestamp: Date.now(),
            read: false
          };
          
          addNotification(newNotification);

          // Show browser notification if enabled and permission granted
          if (settings.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`⏰ Reminder: ${task.title}`, {
              body: `Starts in ${Math.round(timeDiff)} minutes`,
              icon: '/favicon.ico',
              tag: `reminder-${task.id}`
            });
          }
        }
      }
    });
  };

  // Check every minute
  useEffect(() => {
    const interval = setInterval(checkUpcomingTasks, 60000); // 1 minute
    checkUpcomingTasks(); // Initial check
    
    return () => clearInterval(interval);
  }, [tasks, settings, notifications.length]); // Add dependencies

  const value = {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    settings,
    setSettings
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};