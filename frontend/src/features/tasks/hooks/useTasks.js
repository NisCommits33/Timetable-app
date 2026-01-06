/**
 * Custom Hook: useTasks
 * Centralized task management with all CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, migrateTasks } from '../../../utils/storageUtils';
import { validateTaskTime, sanitizeTaskInput } from '../../../utils/taskValidation';

const STORAGE_KEY = 'timetable-tasks';

/**
 * Custom hook for managing tasks with localStorage persistence
 * @param {Array} initialTasks - Initial tasks if localStorage is empty
 * @returns {Object} - Task state and operations
 */
export const useTasks = (initialTasks = []) => {
    // Initialize tasks from localStorage or use initial data
    const [tasks, setTasks] = useState(() => {
        const stored = getItem(STORAGE_KEY);
        if (stored && Array.isArray(stored)) {
            // Migrate old tasks to ensure they have all required fields
            return migrateTasks(stored);
        }
        return initialTasks;
    });

    // Persist tasks to localStorage whenever they change
    useEffect(() => {
        setItem(STORAGE_KEY, tasks);
    }, [tasks]);

    /**
     * Add a new task
     * @param {Object} newTask - Task to add
     * @returns {Object} - { success: boolean, error: string | null, task: Object | null }
     */
    const addTask = useCallback((newTask) => {
        // Sanitize input
        const sanitized = sanitizeTaskInput(newTask);

        // Validate time conflicts
        const validation = validateTaskTime(sanitized, tasks);
        if (!validation.isValid) {
            return {
                success: false,
                error: `Time conflict with: ${validation.conflicts.map(t => t.title).join(', ')}`,
                task: null
            };
        }

        // Generate ID and timestamps
        const taskToAdd = {
            ...sanitized,
            id: Date.now(), // Simple ID generation
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setTasks(prev => [...prev, taskToAdd]);

        return {
            success: true,
            error: null,
            task: taskToAdd
        };
    }, [tasks]);

    /**
     * Update an existing task
     * @param {number} taskId - ID of task to update
     * @param {Object} updates - Fields to update
     * @returns {Object} - { success: boolean, error: string | null }
     */
    const updateTask = useCallback((taskId, updates) => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return { success: false, error: 'Task not found' };
        }

        const updatedTask = {
            ...tasks[taskIndex],
            ...sanitizeTaskInput(updates),
            updatedAt: new Date().toISOString()
        };

        // Validate time conflicts (excluding the task being edited)
        if (updates.startTime || updates.endTime || updates.day) {
            const validation = validateTaskTime(updatedTask, tasks, taskId);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `Time conflict with: ${validation.conflicts.map(t => t.title).join(', ')}`
                };
            }
        }

        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

        return { success: true, error: null };
    }, [tasks]);

    /**
     * Delete a task
     * @param {number} taskId - ID of task to delete
     * @returns {boolean} - True if deleted
     */
    const deleteTask = useCallback((taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        return true;
    }, []);

    /**
     * Toggle task completion status
     * @param {number} taskId - ID of task to toggle
     * @param {Object} completionData - Optional completion data
     */
    const toggleCompletion = useCallback((taskId, completionData = {}) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed,
                    completedAt: !task.completed ? new Date().toISOString() : null,
                    ...completionData,
                    updatedAt: new Date().toISOString()
                };
            }
            return task;
        }));
    }, []);

    /**
     * Move task to a different day
     * @param {number} taskId - ID of task to move
     * @param {string} targetDay - Target day name
     * @returns {Object} - { success: boolean, error: string | null }
     */
    const moveTask = useCallback((taskId, targetDay) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            return { success: false, error: 'Task not found' };
        }

        if (task.day === targetDay) {
            return { success: true, error: null }; // No change needed
        }

        const updatedTask = {
            ...task,
            day: targetDay,
            updatedAt: new Date().toISOString()
        };

        // Validate time conflicts in new day
        const validation = validateTaskTime(updatedTask, tasks, taskId);
        if (!validation.isValid) {
            return {
                success: false,
                error: 'Time conflict in target day'
            };
        }

        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        return { success: true, error: null };
    }, [tasks]);

    /**
     * Duplicate a task
     * @param {number} taskId - ID of task to duplicate
     * @returns {Object} - { success: boolean, newTask: Object | null }
     */
    const duplicateTask = useCallback((taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            return { success: false, newTask: null };
        }

        const duplicated = {
            ...task,
            id: Date.now(),
            title: `${task.title} (Copy)`,
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeTracking: {
                isTracking: false,
                totalTimeSpent: 0,
                currentSessionStart: null,
                sessions: [],
            }
        };

        setTasks(prev => [...prev, duplicated]);
        return { success: true, newTask: duplicated };
    }, [tasks]);

    /**
     * Bulk delete tasks
     * @param {Array<number>} taskIds - Array of task IDs to delete
     */
    const bulkDelete = useCallback((taskIds) => {
        setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
    }, []);

    /**
     * Bulk update tasks
     * @param {Array<number>} taskIds - Array of task IDs to update
     * @param {Object} updates - Updates to apply to all selected tasks
     */
    const bulkUpdate = useCallback((taskIds, updates) => {
        setTasks(prev => prev.map(task => {
            if (taskIds.includes(task.id)) {
                return {
                    ...task,
                    ...sanitizeTaskInput(updates),
                    updatedAt: new Date().toISOString()
                };
            }
            return task;
        }));
    }, []);

    /**
     * Get tasks by filter criteria
     * @param {Object} filters - Filter criteria
     * @returns {Array} - Filtered tasks
     */
    const getFilteredTasks = useCallback((filters = {}) => {
        let filtered = [...tasks];

        if (filters.day) {
            filtered = filtered.filter(t => t.day === filters.day);
        }

        if (filters.category) {
            filtered = filtered.filter(t => t.category === filters.category);
        }

        if (filters.priority) {
            filtered = filtered.filter(t => t.priority === filters.priority);
        }

        if (filters.completed !== undefined) {
            filtered = filtered.filter(t => t.completed === filters.completed);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(searchLower) ||
                (t.description && t.description.toLowerCase().includes(searchLower)) ||
                (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
        }

        return filtered;
    }, [tasks]);

    /**
     * Get task by ID
     * @param {number} taskId - Task ID
     * @returns {Object|null} - Task or null if not found
     */
    const getTaskById = useCallback((taskId) => {
        return tasks.find(t => t.id === taskId) || null;
    }, [tasks]);

    /**
     * Clear all completed tasks
     */
    const clearCompleted = useCallback(() => {
        setTasks(prev => prev.filter(t => !t.completed));
    }, []);

    return {
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleCompletion,
        moveTask,
        duplicateTask,
        bulkDelete,
        bulkUpdate,
        getFilteredTasks,
        getTaskById,
        clearCompleted
    };
};

export default useTasks;
