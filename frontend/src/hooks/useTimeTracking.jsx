// hooks/useTimeTracking.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing time tracking functionality
 * @param {Array} tasks - Array of tasks
 * @param {Function} setTasks - State setter for tasks
 */
export function useTimeTracking(tasks, setTasks) {
  const [activeTimer, setActiveTimer] = useState(null);

  /**
   * Starts time tracking for a task
   */
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

  /**
   * Stops time tracking for a task
   */
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
            actualDuration: newTotalTime
          };
        }
        return task;
      })
    );
    
    setActiveTimer(null);
  }, [setTasks]);

  /**
   * Toggles time tracking (start/stop)
   */
  const toggleTracking = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.timeTracking.isTracking) {
      stopTracking(taskId);
    } else {
      startTracking(taskId);
    }
  }, [tasks, startTracking, stopTracking]);

  /**
   * Manually adds time to a task
   */
  // In useTimeTracking.js - add debug to addManualTime
// In useTimeTracking.js - update addManualTime with better debugging
const addManualTime = useCallback((taskId, minutes) => {
  console.log('🕒 addManualTime called:', { taskId, minutes });
  
  // Convert minutes to milliseconds
  const milliseconds = minutes * 60 * 1000;
  
  setTasks(prevTasks => 
    prevTasks.map(task => {
      if (task.id === taskId) {
        const newTotalTime = task.timeTracking.totalTimeSpent + milliseconds;
        console.log('🕒 Task updated:', {
          taskId,
          oldTime: task.timeTracking.totalTimeSpent,
          added: milliseconds,
          newTime: newTotalTime
        });
        
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
          }
        };
      }
      return task;
    })
  );
}, [setTasks]);

  /**
   * Resets time tracking for a task
   */
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

/**
 * Calculates total time spent from sessions
 */
function calculateTotalTimeSpent(timeTracking) {
  if (!timeTracking.isTracking) return timeTracking.totalTimeSpent;
  
  const currentSessionTime = Date.now() - timeTracking.currentSessionStart;
  return timeTracking.totalTimeSpent + currentSessionTime;
}

/**
 * Formats seconds into human-readable time
 */
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

/**
 * Formats time for display (short version)
 */
export function formatTimeShort(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}