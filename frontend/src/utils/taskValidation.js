/**
 * Task Validation Module
 * Handles all validation logic for tasks including time conflicts,
 * data validation, and input sanitization
 */

import { timeToMinutes, isValidTimeFormat } from './timeUtils';

/**
 * Validates if a new/edited task has time conflicts with existing tasks
 * @param {Object} newTask - The task to validate
 * @param {Array} existingTasks - Array of all existing tasks
 * @param {number|null} editingId - ID of task being edited (skip conflict check with itself)
 * @returns {Object} - { isValid: boolean, conflicts: Array }
 */
export const validateTaskTime = (newTask, existingTasks = [], editingId = null) => {
    const conflicts = existingTasks.filter((task) => {
        // Skip conflict check with the task we're currently editing
        if (task.id === editingId) return false;

        // Only check tasks on the same day (no cross-day conflicts)
        if (task.day !== newTask.day) return false;

        const newStart = timeToMinutes(newTask.startTime);
        const newEnd = timeToMinutes(newTask.endTime);
        const existingStart = timeToMinutes(task.startTime);
        const existingEnd = timeToMinutes(task.endTime);

        // Check for time overlap: new task starts before existing task ends
        // AND new task ends after existing task starts
        return newStart < existingEnd && newEnd > existingStart;
    });

    return {
        isValid: conflicts.length === 0,
        conflicts: conflicts
    };
};

/**
 * Validates all required fields in a task
 * @param {Object} task - The task to validate
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateTaskData = (task) => {
    const errors = {};

    // Title validation
    if (!task.title || task.title.trim().length === 0) {
        errors.title = 'Task title is required';
    } else if (task.title.length > 200) {
        errors.title = 'Task title must be less than 200 characters';
    }

    // Start time validation
    if (!task.startTime) {
        errors.startTime = 'Start time is required';
    } else if (!isValidTimeFormat(task.startTime)) {
        errors.startTime = 'Invalid start time format (use HH:MM)';
    }

    // End time validation
    if (!task.endTime) {
        errors.endTime = 'End time is required';
    } else if (!isValidTimeFormat(task.endTime)) {
        errors.endTime = 'Invalid end time format (use HH:MM)';
    }

    // Compare start and end times
    if (task.startTime && task.endTime && isValidTimeFormat(task.startTime) && isValidTimeFormat(task.endTime)) {
        const start = timeToMinutes(task.startTime);
        const end = timeToMinutes(task.endTime);

        if (start >= end) {
            errors.time = 'End time must be after start time';
        }
    }

    // Day validation
    if (!task.day) {
        errors.day = 'Day is required';
    } else {
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!validDays.includes(task.day)) {
            errors.day = 'Invalid day';
        }
    }

    // Date validation (if provided)
    if (task.date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(task.date)) {
            errors.date = 'Invalid date format (use YYYY-MM-DD)';
        }
    }

    // Category validation
    if (task.category) {
        const validCategories = ['work', 'personal', 'fitness', 'learning', 'other'];
        if (!validCategories.includes(task.category)) {
            errors.category = 'Invalid category';
        }
    }

    // Priority validation
    if (task.priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(task.priority)) {
            errors.priority = 'Invalid priority level';
        }
    }

    // Description validation
    if (task.description && task.description.length > 1000) {
        errors.description = 'Description must be less than 1000 characters';
    }

    // Location validation
    if (task.location && task.location.length > 200) {
        errors.location = 'Location must be less than 200 characters';
    }

    // Notes validation
    if (task.notes && task.notes.length > 2000) {
        errors.notes = 'Notes must be less than 2000 characters';
    }

    // Tags validation
    if (task.tags && Array.isArray(task.tags)) {
        if (task.tags.length > 20) {
            errors.tags = 'Maximum 20 tags allowed';
        }
        task.tags.forEach((tag, index) => {
            if (typeof tag !== 'string' || tag.length > 50) {
                errors.tags = `Tag ${index + 1} is invalid (max 50 characters)`;
            }
        });
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

/**
 * Sanitizes task input to prevent XSS and clean data
 * @param {Object} task - The task to sanitize
 * @returns {Object} - Sanitized task
 */
export const sanitizeTaskInput = (task) => {
    const sanitized = { ...task };

    // Sanitize string fields
    const stringFields = ['title', 'description', 'location', 'notes'];
    stringFields.forEach(field => {
        if (sanitized[field] && typeof sanitized[field] === 'string') {
            // Trim whitespace
            sanitized[field] = sanitized[field].trim();

            // Remove potentially dangerous characters (basic XSS prevention)
            sanitized[field] = sanitized[field]
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        }
    });

    // Sanitize tags
    if (sanitized.tags && Array.isArray(sanitized.tags)) {
        sanitized.tags = sanitized.tags
            .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
            .map(tag => tag.trim().toLowerCase())
            .slice(0, 20); // Limit to 20 tags
    }

    // Ensure boolean fields are actually booleans
    if (sanitized.completed !== undefined) {
        sanitized.completed = Boolean(sanitized.completed);
    }

    // Ensure numeric fields are numbers
    if (sanitized.estimatedDuration) {
        sanitized.estimatedDuration = Number(sanitized.estimatedDuration) || 3600;
    }
    if (sanitized.actualDuration) {
        sanitized.actualDuration = Number(sanitized.actualDuration) || 0;
    }

    return sanitized;
};

/**
 * Gets all validation errors for a task
 * @param {Object} task - The task to validate
 * @param {Array} existingTasks - Array of existing tasks
 * @param {number|null} editingId - ID if editing
 * @returns {Array} - Array of error messages
 */
export const getValidationErrors = (task, existingTasks = [], editingId = null) => {
    const errors = [];

    // Check data validation
    const dataValidation = validateTaskData(task);
    if (!dataValidation.isValid) {
        Object.values(dataValidation.errors).forEach(error => {
            errors.push(error);
        });
    }

    // Check time conflicts
    const timeValidation = validateTaskTime(task, existingTasks, editingId);
    if (!timeValidation.isValid) {
        const conflictTitles = timeValidation.conflicts.map(t => t.title).join(', ');
        errors.push(`Time conflict with: ${conflictTitles}`);
    }

    return errors;
};

/**
 * Quick validation for required fields only (used for draft saves)
 * @param {Object} task - The task to validate
 * @returns {boolean} - True if basic fields are present
 */
export const hasRequiredFields = (task) => {
    return !!(
        task.title &&
        task.startTime &&
        task.endTime &&
        task.day
    );
};

/**
 * Validates time tracking data
 * @param {Object} timeTracking - Time tracking object
 * @returns {boolean} - True if valid
 */
export const validateTimeTracking = (timeTracking) => {
    if (!timeTracking) return false;

    return (
        typeof timeTracking.isTracking === 'boolean' &&
        typeof timeTracking.totalTimeSpent === 'number' &&
        timeTracking.totalTimeSpent >= 0 &&
        Array.isArray(timeTracking.sessions)
    );
};

/**
 * Validates recurrence settings
 * @param {Object} recurrence - Recurrence object
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRecurrence = (recurrence) => {
    if (!recurrence || !recurrence.enabled) {
        return { isValid: true, error: null };
    }

    const validPatterns = ['daily', 'weekly', 'monthly', 'custom'];
    if (!validPatterns.includes(recurrence.pattern)) {
        return { isValid: false, error: 'Invalid recurrence pattern' };
    }

    if (recurrence.interval && recurrence.interval < 1) {
        return { isValid: false, error: 'Recurrence interval must be at least 1' };
    }

    if (recurrence.pattern === 'weekly' && !recurrence.daysOfWeek) {
        return { isValid: false, error: 'Weekly recurrence requires days of week' };
    }

    return { isValid: true, error: null };
};

export default {
    validateTaskTime,
    validateTaskData,
    sanitizeTaskInput,
    getValidationErrors,
    hasRequiredFields,
    validateTimeTracking,
    validateRecurrence
};
