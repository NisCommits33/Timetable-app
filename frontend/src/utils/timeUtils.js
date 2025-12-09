/**
 * Time Utilities Module
 * Handles all time-related calculations, conversions, and formatting
 */

/**
 * Converts time string (HH:MM) to total minutes
 * @param {string} timeStr - Time in "HH:MM" format (e.g., "14:30")
 * @returns {number} - Total minutes (e.g., 870 for "14:30")
 * @example
 * timeToMinutes("14:30") // Returns 870
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') {
    console.warn('Invalid time string:', timeStr);
    return 0;
  }
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    console.warn('Invalid time format:', timeStr);
    return 0;
  }
  
  return hours * 60 + minutes;
};

/**
 * Converts minutes to time string (HH:MM)
 * @param {number} minutes - Total minutes
 * @returns {string} - Time in "HH:MM" format
 * @example
 * minutesToTime(870) // Returns "14:30"
 */
export const minutesToTime = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 0) {
    return '00:00';
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Calculates duration between two times in minutes
 * @param {string} startTime - Start time in "HH:MM" format
 * @param {string} endTime - End time in "HH:MM" format
 * @returns {number} - Duration in minutes
 * @example
 * calculateDuration("09:00", "17:00") // Returns 480 (8 hours)
 */
export const calculateDuration = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  // Handle cases where end time is before start time (crosses midnight)
  if (end < start) {
    return (24 * 60) - start + end;
  }
  
  return end - start;
};

/**
 * Formats seconds into human-readable duration
 * @param {number} seconds - Duration in seconds
 * @param {boolean} compact - If true, returns compact format (e.g., "1h 30m")
 * @returns {string} - Formatted duration string
 * @example
 * formatDuration(3665) // Returns "1 hour 1 minute"
 * formatDuration(3665, true) // Returns "1h 1m"
 */
export const formatDuration = (seconds, compact = false) => {
  if (!seconds || seconds < 0) return compact ? '0m' : '0 minutes';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (compact) {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 && hours === 0) parts.push(`${secs}s`);
    return parts.join(' ') || '0m';
  }
  
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  if (secs > 0 && hours === 0 && minutes === 0) {
    parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
  }
  
  return parts.join(' ') || '0 minutes';
};

/**
 * Formats milliseconds to a readable duration
 * @param {number} milliseconds - Duration in milliseconds
 * @param {boolean} compact - If true, returns compact format
 * @returns {string} - Formatted duration
 */
export const formatMilliseconds = (milliseconds, compact = false) => {
  return formatDuration(Math.floor(milliseconds / 1000), compact);
};

/**
 * Checks if a given date and time is in the past
 * @param {string} date - Date in "YYYY-MM-DD" format
 * @param {string} time - Time in "HH:MM" format
 * @returns {boolean} - True if the datetime is in the past
 */
export const isTimeInPast = (date, time) => {
  if (!date || !time) return false;
  
  const taskDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  
  return taskDateTime < now;
};

/**
 * Checks if a task is currently active (current time is between start and end)
 * @param {string} date - Date in "YYYY-MM-DD" format
 * @param {string} startTime - Start time in "HH:MM" format
 * @param {string} endTime - End time in "HH:MM" format
 * @returns {boolean} - True if task is currently active
 */
export const isTaskActive = (date, startTime, endTime) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Only check if it's today
  if (date !== today) return false;
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  return currentMinutes >= start && currentMinutes <= end;
};

/**
 * Gets the current date in YYYY-MM-DD format
 * @returns {string} - Current date
 */
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Gets the current time in HH:MM format
 * @returns {string} - Current time
 */
export const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

/**
 * Adds minutes to a time string
 * @param {string} timeStr - Time in "HH:MM" format
 * @param {number} minutesToAdd - Minutes to add (can be negative)
 * @returns {string} - New time in "HH:MM" format
 * @example
 * addMinutesToTime("14:30", 45) // Returns "15:15"
 */
export const addMinutesToTime = (timeStr, minutesToAdd) => {
  const totalMinutes = timeToMinutes(timeStr) + minutesToAdd;
  const normalized = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  return minutesToTime(normalized);
};

/**
 * Validates if a time string is in correct HH:MM format
 * @param {string} timeStr - Time string to validate
 * @returns {boolean} - True if valid
 */
export const isValidTimeFormat = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return false;
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
};

/**
 * Gets time difference between two times in a human-readable format
 * @param {string} startTime - Start time in "HH:MM"
 * @param {string} endTime - End time in "HH:MM"
 * @returns {string} - Human-readable duration
 */
export const getTimeDifference = (startTime, endTime) => {
  const durationMinutes = calculateDuration(startTime, endTime);
  return formatDuration(durationMinutes * 60, true);
};
