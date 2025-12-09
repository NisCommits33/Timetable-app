/**
 * Storage Utilities Module
 * Robust localStorage manager with error handling, versioning, and migration support
 */

const STORAGE_VERSION = '1.0';
const VERSION_KEY = 'timetable-version';

/**
 * Safely gets an item from localStorage with error handling
 * @param {string} key - The storage key
 * @param {any} defaultValue - Default value if not found or error occurs
 * @returns {any} - Retrieved value or default
 */
export const getItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
};

/**
 * Safely sets an item in localStorage with error handling
 * @param {string} key - The storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} - True if successful, false otherwise
 */
export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Attempting cleanup...');
            cleanupOldData();

            // Try again after cleanup
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (retryError) {
                console.error('Failed to save after cleanup:', retryError);
                return false;
            }
        } else {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    }
};

/**
 * Removes an item from localStorage
 * @param {string} key - The storage key
 * @returns {boolean} - True if successful
 */
export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
        return false;
    }
};

/**
 * Clears all localStorage data (use with caution!)
 * @returns {boolean} - True if successful
 */
export const clear = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

/**
 * Gets all keys in localStorage
 * @returns {Array<string>} - Array of keys
 */
export const getAllKeys = () => {
    try {
        return Object.keys(localStorage);
    } catch (error) {
        console.error('Error getting localStorage keys:', error);
        return [];
    }
};

/**
 * Gets the current storage usage in bytes
 * @returns {number} - Approximate size in bytes
 */
export const getStorageSize = () => {
    try {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    } catch (error) {
        console.error('Error calculating storage size:', error);
        return 0;
    }
};

/**
 * Gets storage size in a human-readable format
 * @returns {string} - Size with unit (KB, MB)
 */
export const getStorageSizeFormatted = () => {
    const bytes = getStorageSize();
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Checks if localStorage is available and working
 * @returns {boolean} - True if localStorage is available
 */
export const isStorageAvailable = () => {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Migrates old task data to include new fields
 * @param {Array} tasks - Array of tasks
 * @returns {Array} - Migrated tasks
 */
export const migrateTasks = (tasks) => {
    if (!Array.isArray(tasks)) return [];

    return tasks.map((task) => {
        // Ensure task has all required fields
        const migratedTask = {
            ...task,

            // Add time tracking if missing
            timeTracking: task.timeTracking || {
                isTracking: false,
                totalTimeSpent: 0,
                currentSessionStart: null,
                sessions: [],
            },

            // Add estimated/actual duration if missing
            estimatedDuration: task.estimatedDuration || 3600,
            actualDuration: task.actualDuration || 0,

            // Add metadata if missing
            createdAt: task.createdAt || new Date().toISOString(),
            updatedAt: task.updatedAt || new Date().toISOString(),

            // Add completion fields if missing
            completed: task.completed || false,
            completedAt: task.completedAt || null,

            // Add default arrays if missing
            tags: task.tags || [],
            attachments: task.attachments || [],

            // Add default values for optional fields
            recurrence: task.recurrence || null,
            priority: task.priority || 'medium',
            category: task.category || 'personal',
        };

        return migratedTask;
    });
};

/**
 * Creates a backup of all app data
 * @returns {Object} - Backup object with timestamp
 */
export const createBackup = () => {
    try {
        const backup = {
            version: STORAGE_VERSION,
            timestamp: new Date().toISOString(),
            data: {}
        };

        // Backup all timetable-related keys
        const keys = getAllKeys();
        keys.forEach(key => {
            if (key.startsWith('timetable-')) {
                backup.data[key] = getItem(key);
            }
        });

        return backup;
    } catch (error) {
        console.error('Error creating backup:', error);
        return null;
    }
};

/**
 * Restores data from a backup
 * @param {Object} backup - Backup object
 * @returns {boolean} - True if successful
 */
export const restoreBackup = (backup) => {
    try {
        if (!backup || !backup.data) {
            throw new Error('Invalid backup format');
        }

        // Restore all data
        Object.entries(backup.data).forEach(([key, value]) => {
            setItem(key, value);
        });

        console.log(`Backup from ${backup.timestamp} restored successfully`);
        return true;
    } catch (error) {
        console.error('Error restoring backup:', error);
        return false;
    }
};

/**
 * Downloads backup as JSON file
 * @param {Object} backup - Backup object
 * @param {string} filename - Optional filename
 */
export const downloadBackup = (backup = null, filename = null) => {
    try {
        const data = backup || createBackup();
        if (!data) {
            throw new Error('Failed to create backup');
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `timetable-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error downloading backup:', error);
        return false;
    }
};

/**
 * Cleans up old/unused data to free space
 * @returns {number} - Number of items cleaned
 */
export const cleanupOldData = () => {
    try {
        let cleanedCount = 0;
        const keys = getAllKeys();

        // Remove any old version data or temp keys
        keys.forEach(key => {
            if (key.startsWith('temp-') || key.endsWith('-old')) {
                removeItem(key);
                cleanedCount++;
            }
        });

        console.log(`Cleaned up ${cleanedCount} old storage items`);
        return cleanedCount;
    } catch (error) {
        console.error('Error cleaning up data:', error);
        return 0;
    }
};

/**
 * Checks storage version and performs migration if needed
 * @returns {boolean} - True if migration was performed
 */
export const checkAndMigrate = () => {
    try {
        const currentVersion = getItem(VERSION_KEY);

        if (!currentVersion) {
            // First time - set version
            setItem(VERSION_KEY, STORAGE_VERSION);
            return false;
        }

        if (currentVersion !== STORAGE_VERSION) {
            console.log(`Migrating from version ${currentVersion} to ${STORAGE_VERSION}`);

            // Perform migration logic here
            const tasks = getItem('timetable-tasks', []);
            const migratedTasks = migrateTasks(tasks);
            setItem('timetable-tasks', migratedTasks);

            // Update version
            setItem(VERSION_KEY, STORAGE_VERSION);

            return true;
        }

        return false;
    } catch (error) {
        console.error('Error during migration:', error);
        return false;
    }
};

/**
 * Get storage statistics
 * @returns {Object} - Storage stats
 */
export const getStorageStats = () => {
    return {
        available: isStorageAvailable(),
        size: getStorageSize(),
        sizeFormatted: getStorageSizeFormatted(),
        itemCount: getAllKeys().length,
        version: getItem(VERSION_KEY, 'unknown'),
        quotaUsagePercent: ((getStorageSize() / (5 * 1024 * 1024)) * 100).toFixed(2) + '%'
    };
};

export default {
    getItem,
    setItem,
    removeItem,
    clear,
    getAllKeys,
    getStorageSize,
    getStorageSizeFormatted,
    isStorageAvailable,
    migrateTasks,
    createBackup,
    restoreBackup,
    downloadBackup,
    cleanupOldData,
    checkAndMigrate,
    getStorageStats
};
