// useTimeTracking.js - Remove notification integration for now
import { useState, useEffect, useCallback } from 'react';
// REMOVE: import { useNotifications } from '../contexts/NotificationContext';

export function useTimeTracking(tasks, setTasks) {
  const [activeTimer, setActiveTimer] = useState(null);

  const startTracking = useCallback((taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            timeTracking: {
              ...task.timeTracking,
              isTracking: true,
              currentSessionStart: Date.now()
            }
          };
        }
        
        // Stop any other active timers
        if (task.timeTracking.isTracking) {
          return {
            ...task,
            timeTracking: {
              ...task.timeTracking,
              isTracking: false,
              totalTimeSpent: calculateTotalTimeSpent(task.timeTracking),
              sessions: [
                ...task.timeTracking.sessions,
                {
                  start: task.timeTracking.currentSessionStart,
                  end: Date.now(),
                  duration: Date.now() - task.timeTracking.currentSessionStart
                }
              ]
            }
          };
        }
        
        return task;
      })
    );
    
    setActiveTimer(taskId);
  }, [setTasks]);

  const stopTracking = useCallback((taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && task.timeTracking.isTracking) {
          const sessionDuration = Date.now() - task.timeTracking.currentSessionStart;
          const newTotalTime = task.timeTracking.totalTimeSpent + sessionDuration;
          
          return {
            ...task,
            timeTracking: {
              ...task.timeTracking,
              isTracking: false,
              totalTimeSpent: newTotalTime,
              currentSessionStart: null,
              sessions: [
                ...task.timeTracking.sessions,
                {
                  start: task.timeTracking.currentSessionStart,
                  end: Date.now(),
                  duration: sessionDuration
                }
              ]
            },
            actualDuration: Math.floor(newTotalTime / 1000)
          };
        }
        return task;
      })
    );
    
    setActiveTimer(null);
  }, [setTasks]);

  const toggleTracking = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.timeTracking.isTracking) {
      stopTracking(taskId);
    } else {
      startTracking(taskId);
    }
  }, [tasks, startTracking, stopTracking]);

  const addManualTime = useCallback((taskId, minutes) => {
    const milliseconds = minutes * 60 * 1000;
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newTotalTime = task.timeTracking.totalTimeSpent + milliseconds;
          
          return {
            ...task,
            timeTracking: {
              ...task.timeTracking,
              totalTimeSpent: newTotalTime,
              sessions: [
                ...task.timeTracking.sessions,
                {
                  start: Date.now() - milliseconds,
                  end: Date.now(),
                  duration: milliseconds,
                  manual: true
                }
              ]
            },
            actualDuration: Math.floor(newTotalTime / 1000)
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  const resetTracking = useCallback((taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            timeTracking: {
              isTracking: false,
              totalTimeSpent: 0,
              currentSessionStart: null,
              sessions: []
            },
            actualDuration: 0
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  // Auto-stop timer when component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        stopTracking(activeTimer);
      }
    };
  }, [activeTimer, stopTracking]);

  return {
    activeTimer,
    startTracking,
    stopTracking,
    toggleTracking,
    addManualTime,
    resetTracking
  };
}

// Keep the helper functions
function calculateTotalTimeSpent(timeTracking) {
  if (!timeTracking.isTracking) return timeTracking.totalTimeSpent;
  const currentSessionTime = Date.now() - timeTracking.currentSessionStart;
  return timeTracking.totalTimeSpent + currentSessionTime;
}

export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function formatTimeShort(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}