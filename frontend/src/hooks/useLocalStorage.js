/**
 * Custom Hook: useLocalStorage
 * Enhanced localStorage hook with migration and error handling
 */

import { useState, useEffect } from 'react';
import { getItem, setItem, migrateTasks } from '../utils/storageUtils';

/**
 * Custom hook for managing localStorage with automatic persistence
 * Enhanced version with migration support
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if no stored value exists
 * @returns {[any, Function]} - State value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        // Try to get value from localStorage
        const stored = getItem(key);

        if (stored !== null) {
            // Special handling for tasks - migrate old data
            if (key === 'timetable-tasks' && Array.isArray(stored)) {
                return migrateTasks(stored);
            }
            return stored;
        }

        // Return initial value if nothing in storage
        return initialValue;
    });

    // Effect to persist data to localStorage whenever value changes
    useEffect(() => {
        const success = setItem(key, value);

        if (!success) {
            console.error(`Failed to save ${key} to localStorage`);
            // Could trigger a user notification here
        }
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
