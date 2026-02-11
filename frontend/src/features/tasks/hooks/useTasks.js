/**
 * Custom Hook: useTasks
 * Centralized task management with Supabase cloud sync and local fallback
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getItem, setItem, migrateTasks } from '../../../utils/storageUtils';
import { validateTaskTime, sanitizeTaskInput } from '../../../utils/taskValidation';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../providers/AuthProvider';

const STORAGE_KEY = 'timetable-tasks';

/**
 * Custom hook for managing tasks with Supabase sync and localStorage fallback
 * @param {Array} initialTasks - Initial tasks if for first-time use
 * @returns {Object} - Task state and operations
 */
export const useTasks = (initialTasks = []) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFirstRender = useRef(true);

    // Initial load: from Supabase if logged in, otherwise localStorage
    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('tasks')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: true });

                    if (error) throw error;

                    if (data && data.length > 0) {
                        setTasks(migrateTasks(data));
                    } else {
                        // If user has no tasks in cloud, check local storage for migration
                        const localStored = getItem(STORAGE_KEY);
                        if (localStored && localStored.length > 0) {
                            const migrated = migrateTasks(localStored);
                            // Push local tasks to cloud
                            const tasksToPush = migrated.map(t => ({
                                ...t,
                                user_id: user.id,
                                id: typeof t.id === 'string' && t.id.includes('-') ? t.id : crypto.randomUUID()
                            }));

                            const { error: pushError } = await supabase
                                .from('tasks')
                                .insert(tasksToPush);

                            if (pushError) console.error('Migration error:', pushError);
                            setTasks(tasksToPush);
                        } else {
                            setTasks(initialTasks);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching tasks from Supabase:', error);
                    // Fallback to local on error
                    const stored = getItem(STORAGE_KEY);
                    setTasks(stored ? migrateTasks(stored) : initialTasks);
                }
            } else {
                const stored = getItem(STORAGE_KEY);
                setTasks(stored ? migrateTasks(stored) : initialTasks);
            }
            setLoading(false);
        };

        loadTasks();
    }, [user, initialTasks]);

    // Real-time subscription
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`tasks_user_${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tasks',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTasks(prev => {
                        if (prev.find(t => t.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                } else if (payload.eventType === 'UPDATE') {
                    setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
                } else if (payload.eventType === 'DELETE') {
                    setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Persist to localStorage as secondary backup/offline cache
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (tasks.length > 0) {
            setItem(STORAGE_KEY, tasks);
        }
    }, [tasks]);

    /**
     * Add a new task
     */
    const addTask = useCallback(async (newTask) => {
        const sanitized = sanitizeTaskInput(newTask);
        const validation = validateTaskTime(sanitized, tasks);

        if (!validation.isValid) {
            return {
                success: false,
                error: `Time conflict with: ${validation.conflicts.map(t => t.title).join(', ')}`,
                task: null
            };
        }

        const taskToAdd = {
            ...sanitized,
            id: crypto.randomUUID(), // Use UUID for Supabase
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (user) {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert([{ ...taskToAdd, user_id: user.id }])
                    .select()
                    .single();

                if (error) throw error;
                // Realtime will handle local state update if we want, 
                // but usually optimistic update is better UX:
                setTasks(prev => [...prev, data]);
                return { success: true, error: null, task: data };
            } catch (err) {
                console.error('Supabase addTask error:', err);
                return { success: false, error: err.message, task: null };
            }
        } else {
            // Local only mode
            setTasks(prev => [...prev, taskToAdd]);
            return { success: true, error: null, task: taskToAdd };
        }
    }, [tasks, user]);

    /**
     * Update an existing task
     */
    const updateTask = useCallback(async (taskId, updates) => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return { success: false, error: 'Task not found' };

        const updatedTask = {
            ...tasks[taskIndex],
            ...sanitizeTaskInput(updates),
            updatedAt: new Date().toISOString()
        };

        if (updates.startTime || updates.endTime || updates.day) {
            const validation = validateTaskTime(updatedTask, tasks, taskId);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `Time conflict with: ${validation.conflicts.map(t => t.title).join(', ')}`
                };
            }
        }

        if (user) {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .update(updatedTask)
                    .eq('id', taskId)
                    .select()
                    .single();

                if (error) throw error;
                setTasks(prev => prev.map(t => t.id === taskId ? data : t));
                return { success: true, error: null };
            } catch (err) {
                console.error('Supabase updateTask error:', err);
                return { success: false, error: err.message };
            }
        } else {
            setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
            return { success: true, error: null };
        }
    }, [tasks, user]);

    /**
     * Delete a task
     */
    const deleteTask = useCallback(async (taskId) => {
        if (user) {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', taskId);

                if (error) throw error;
                setTasks(prev => prev.filter(t => t.id !== taskId));
                return true;
            } catch (err) {
                console.error('Supabase deleteTask error:', err);
                return false;
            }
        } else {
            setTasks(prev => prev.filter(t => t.id !== taskId));
            return true;
        }
    }, [user]);

    /**
     * Toggle task completion status
     */
    const toggleCompletion = useCallback((taskId, completionData = {}) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updates = {
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null,
            ...completionData,
        };

        updateTask(taskId, updates);
    }, [tasks, updateTask]);

    /**
     * Move task to a different day
     */
    const moveTask = useCallback((taskId, targetDay) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.day === targetDay) return { success: true, error: null };

        return updateTask(taskId, { day: targetDay });
    }, [tasks, updateTask]);

    /**
     * Duplicate a task
     */
    const duplicateTask = useCallback((taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return { success: false, newTask: null };

        const duplicated = {
            ...task,
            title: `${task.title} (Copy)`,
            completed: false,
            completedAt: null,
            timeTracking: {
                isTracking: false,
                totalTimeSpent: 0,
                currentSessionStart: null,
                sessions: [],
            }
        };
        // Remove ID and timestamps to let addTask handle them
        delete duplicated.id;
        delete duplicated.createdAt;
        delete duplicated.updatedAt;

        return addTask(duplicated);
    }, [tasks, addTask]);

    /**
     * Bulk delete tasks
     */
    const bulkDelete = useCallback(async (taskIds) => {
        if (user) {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .in('id', taskIds);

                if (error) throw error;
                setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
            } catch (err) {
                console.error('Supabase bulkDelete error:', err);
            }
        } else {
            setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
        }
    }, [user]);

    /**
     * Bulk update tasks
     */
    const bulkUpdate = useCallback(async (taskIds, updates) => {
        if (user) {
            try {
                const sanitized = sanitizeTaskInput(updates);
                const { error } = await supabase
                    .from('tasks')
                    .update({ ...sanitized, updatedAt: new Date().toISOString() })
                    .in('id', taskIds);

                if (error) throw error;
                setTasks(prev => prev.map(t => taskIds.includes(t.id) ? { ...t, ...sanitized } : t));
            } catch (err) {
                console.error('Supabase bulkUpdate error:', err);
            }
        } else {
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
        }
    }, [user, tasks]);

    const getFilteredTasks = useCallback((filters = {}) => {
        let filtered = [...tasks];
        if (filters.day) filtered = filtered.filter(t => t.day === filters.day);
        if (filters.category) filtered = filtered.filter(t => t.category === filters.category);
        if (filters.priority) filtered = filtered.filter(t => t.priority === filters.priority);
        if (filters.completed !== undefined) filtered = filtered.filter(t => t.completed === filters.completed);
        if (filters.search) {
            const s = filters.search.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(s) ||
                (t.description && t.description.toLowerCase().includes(s))
            );
        }
        return filtered;
    }, [tasks]);

    const getTaskById = useCallback((id) => tasks.find(t => t.id === id) || null, [tasks]);
    const clearCompleted = useCallback(() => {
        const completedIds = tasks.filter(t => t.completed).map(t => t.id);
        bulkDelete(completedIds);
    }, [tasks, bulkDelete]);

    return {
        tasks,
        loading,
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
