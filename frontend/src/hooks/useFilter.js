/**
 * Custom Hook: useFilter
 * Manages search and filter state for tasks
 */

import { useState, useMemo, useCallback } from 'react';

/**
 * Hook for filtering and searching tasks
 * @param {Array} tasks - All tasks to filter
 * @returns {Object} - Filter state and controls
 */
export const useFilter = (tasks) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        categories: [], // ['work', 'personal', ...]
        priorities: [],  // ['high', 'medium', 'low']
        days: [],        // ['Monday', 'Tuesday', ...]
        tags: [],        // ['urgent', 'health', ...]
        completed: null, // null, true, or false
        dateRange: {
            start: null,   // YYYY-MM-DD
            end: null      // YYYY-MM-DD
        },
        timeOfDay: null  // 'morning', 'afternoon', 'evening', 'night'
    });

    /**
     * Get time of day category from time string
     */
    const getTimeOfDay = (timeStr) => {
        const hour = parseInt(timeStr.split(':')[0]);
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    };

    /**
     * Filter tasks based on all active filters
     */
    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        // Search query filter (search in title, description, tags, notes)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(task => {
                return (
                    task.title?.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query) ||
                    task.notes?.toLowerCase().includes(query) ||
                    task.location?.toLowerCase().includes(query) ||
                    task.tags?.some(tag => tag.toLowerCase().includes(query))
                );
            });
        }

        // Category filter
        if (filters.categories.length > 0) {
            result = result.filter(task =>
                filters.categories.includes(task.category)
            );
        }

        // Priority filter
        if (filters.priorities.length > 0) {
            result = result.filter(task =>
                filters.priorities.includes(task.priority)
            );
        }

        // Day filter
        if (filters.days.length > 0) {
            result = result.filter(task =>
                filters.days.includes(task.day)
            );
        }

        // Tags filter (task must have at least one of the selected tags)
        if (filters.tags.length > 0) {
            result = result.filter(task =>
                task.tags?.some(tag => filters.tags.includes(tag))
            );
        }

        // Completion status filter
        if (filters.completed !== null) {
            result = result.filter(task =>
                task.completed === filters.completed
            );
        }

        // Date range filter
        if (filters.dateRange.start || filters.dateRange.end) {
            result = result.filter(task => {
                if (!task.date) return false;

                const taskDate = task.date;
                const start = filters.dateRange.start;
                const end = filters.dateRange.end;

                if (start && end) {
                    return taskDate >= start && taskDate <= end;
                } else if (start) {
                    return taskDate >= start;
                } else if (end) {
                    return taskDate <= end;
                }
                return true;
            });
        }

        // Time of day filter
        if (filters.timeOfDay) {
            result = result.filter(task => {
                const taskTimeOfDay = getTimeOfDay(task.startTime);
                return taskTimeOfDay === filters.timeOfDay;
            });
        }

        return result;
    }, [tasks, searchQuery, filters]);

    /**
     * Update search query
     */
    const updateSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    /**
     * Update a specific filter
     */
    const updateFilter = useCallback((filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    }, []);

    /**
     * Toggle a value in an array filter (e.g., categories, priorities)
     */
    const toggleFilter = useCallback((filterName, value) => {
        setFilters(prev => {
            const currentArray = prev[filterName] || [];
            const newArray = currentArray.includes(value)
                ? currentArray.filter(item => item !== value)
                : [...currentArray, value];

            return {
                ...prev,
                [filterName]: newArray
            };
        });
    }, []);

    /**
     * Clear all filters
     */
    const clearFilters = useCallback(() => {
        setFilters({
            categories: [],
            priorities: [],
            days: [],
            tags: [],
            completed: null,
            dateRange: {
                start: null,
                end: null
            },
            timeOfDay: null
        });
        setSearchQuery('');
    }, []);

    /**
     * Clear a specific filter
     */
    const clearFilter = useCallback((filterName) => {
        if (filterName === 'dateRange') {
            setFilters(prev => ({
                ...prev,
                dateRange: { start: null, end: null }
            }));
        } else if (Array.isArray(filters[filterName])) {
            setFilters(prev => ({
                ...prev,
                [filterName]: []
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [filterName]: null
            }));
        }
    }, [filters]);

    /**
     * Count active filters
     */
    const activeFilterCount = useMemo(() => {
        let count = 0;

        if (searchQuery.trim()) count++;
        if (filters.categories.length > 0) count++;
        if (filters.priorities.length > 0) count++;
        if (filters.days.length > 0) count++;
        if (filters.tags.length > 0) count++;
        if (filters.completed !== null) count++;
        if (filters.dateRange.start || filters.dateRange.end) count++;
        if (filters.timeOfDay) count++;

        return count;
    }, [searchQuery, filters]);

    /**
     * Get all unique tags from tasks
     */
    const availableTags = useMemo(() => {
        const tagSet = new Set();
        tasks.forEach(task => {
            task.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }, [tasks]);

    /**
     * Get filter summary for display
     */
    const filterSummary = useMemo(() => {
        const summary = [];

        if (searchQuery) {
            summary.push({ type: 'search', label: `Search: "${searchQuery}"`, value: searchQuery });
        }

        filters.categories.forEach(cat => {
            summary.push({ type: 'category', label: `Category: ${cat}`, value: cat });
        });

        filters.priorities.forEach(pri => {
            summary.push({ type: 'priority', label: `Priority: ${pri}`, value: pri });
        });

        filters.days.forEach(day => {
            summary.push({ type: 'day', label: `Day: ${day}`, value: day });
        });

        filters.tags.forEach(tag => {
            summary.push({ type: 'tag', label: `Tag: ${tag}`, value: tag });
        });

        if (filters.completed !== null) {
            summary.push({
                type: 'completed',
                label: filters.completed ? 'Completed' : 'Not Completed',
                value: filters.completed
            });
        }

        if (filters.dateRange.start || filters.dateRange.end) {
            const label = filters.dateRange.start && filters.dateRange.end
                ? `Date: ${filters.dateRange.start} to ${filters.dateRange.end}`
                : filters.dateRange.start
                    ? `Date: From ${filters.dateRange.start}`
                    : `Date: Until ${filters.dateRange.end}`;
            summary.push({ type: 'dateRange', label, value: filters.dateRange });
        }

        if (filters.timeOfDay) {
            summary.push({
                type: 'timeOfDay',
                label: `Time: ${filters.timeOfDay}`,
                value: filters.timeOfDay
            });
        }

        return summary;
    }, [searchQuery, filters]);

    return {
        // State
        searchQuery,
        filters,
        filteredTasks,
        activeFilterCount,
        availableTags,
        filterSummary,

        // Actions
        updateSearch,
        updateFilter,
        toggleFilter,
        clearFilters,
        clearFilter
    };
};

export default useFilter;
