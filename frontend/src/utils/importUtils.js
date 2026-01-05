/**
 * Import Utility Module
 * Handles importing tasks from various formats
 */

/**
 * Parse JSON file
 * @param {string} content - File content
 * @returns {Object} - Parsed result with tasks
 */
export const parseJSON = (content) => {
    try {
        const data = JSON.parse(content);

        // Check if it's our export format
        if (data.version && data.tasks) {
            return {
                success: true,
                tasks: data.tasks,
                metadata: {
                    version: data.version,
                    exportDate: data.exportDate,
                    taskCount: data.taskCount
                }
            };
        }

        // Check if it's just an array of tasks
        if (Array.isArray(data)) {
            return {
                success: true,
                tasks: data,
                metadata: null
            };
        }

        return {
            success: false,
            error: 'Invalid JSON format'
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to parse JSON: ' + error.message
        };
    }
};

/**
 * Parse CSV file
 * @param {string} content - CSV content
 * @returns {Object} - Parsed result with tasks
 */
export const parseCSV = (content) => {
    try {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            return { success: false, error: 'CSV file is empty' };
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const tasks = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

            if (values.length < headers.length) continue;

            const task = {
                id: Date.now() + i, // Generate new ID
                title: values[headers.indexOf('Title')] || '',
                description: values[headers.indexOf('Description')] || '',
                day: values[headers.indexOf('Day')] || '',
                date: values[headers.indexOf('Date')] || '',
                startTime: values[headers.indexOf('Start Time')] || '',
                endTime: values[headers.indexOf('End Time')] || '',
                category: values[headers.indexOf('Category')] || 'personal',
                priority: values[headers.indexOf('Priority')] || 'medium',
                completed: values[headers.indexOf('Completed')]?.toLowerCase() === 'yes',
                tags: values[headers.indexOf('Tags')]?.split(',').map(t => t.trim()).filter(Boolean) || [],
                location: values[headers.indexOf('Location')] || '',
                notes: values[headers.indexOf('Notes')] || '',
                timeTracking: {
                    isTracking: false,
                    totalTimeSpent: 0,
                    currentSessionStart: null,
                    sessions: []
                },
                estimatedDuration: 3600,
                actualDuration: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            tasks.push(task);
        }

        return {
            success: true,
            tasks,
            metadata: { importedFrom: 'CSV', count: tasks.length }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to parse CSV: ' + error.message
        };
    }
};

/**
 * Read file content
 * @param {File} file - File object
 * @returns {Promise<string>} - File content
 */
export const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

/**
 * Import tasks from file
 * @param {File} file - File to import
 * @returns {Promise<Object>} - Import result
 */
export const importTasks = async (file) => {
    try {
        const content = await readFileContent(file);
        const extension = file.name.split('.').pop().toLowerCase();

        let result;
        if (extension === 'json') {
            result = parseJSON(content);
        } else if (extension === 'csv') {
            result = parseCSV(content);
        } else {
            return {
                success: false,
                error: 'Unsupported file format. Please use JSON or CSV.'
            };
        }

        return result;
    } catch (error) {
        return {
            success: false,
            error: 'Failed to read file: ' + error.message
        };
    }
};

/**
 * Validate imported tasks
 * @param {Array} tasks - Tasks to validate
 * @returns {Object} - Validation result
 */
export const validateImportedTasks = (tasks) => {
    const errors = [];
    const warnings = [];
    const validTasks = [];

    tasks.forEach((task, index) => {
        const taskErrors = [];

        // Check required fields
        if (!task.title) taskErrors.push(`Row ${index + 1}: Missing title`);
        if (!task.startTime) taskErrors.push(`Row ${index + 1}: Missing start time`);
        if (!task.endTime) taskErrors.push(`Row ${index + 1}: Missing end time`);
        if (!task.day) taskErrors.push(`Row ${index + 1}: Missing day`);

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (task.startTime && !timeRegex.test(task.startTime)) {
            taskErrors.push(`Row ${index + 1}: Invalid start time format`);
        }
        if (task.endTime && !timeRegex.test(task.endTime)) {
            taskErrors.push(`Row ${index + 1}: Invalid end time format`);
        }

        // Validate category
        const validCategories = ['work', 'personal', 'fitness', 'learning', 'other'];
        if (task.category && !validCategories.includes(task.category)) {
            warnings.push(`Row ${index + 1}: Unknown category "${task.category}", using "personal"`);
            task.category = 'personal';
        }

        // Validate priority
        const validPriorities = ['high', 'medium', 'low'];
        if (task.priority && !validPriorities.includes(task.priority)) {
            warnings.push(`Row ${index + 1}: Unknown priority "${task.priority}", using "medium"`);
            task.priority = 'medium';
        }

        if (taskErrors.length > 0) {
            errors.push(...taskErrors);
        } else {
            validTasks.push(task);
        }
    });

    return {
        valid: errors.length === 0,
        validTasks,
        errors,
        warnings,
        totalTasks: tasks.length,
        validCount: validTasks.length,
        invalidCount: tasks.length - validTasks.length
    };
};

export default {
    parseJSON,
    parseCSV,
    importTasks,
    validateImportedTasks,
    readFileContent
};
