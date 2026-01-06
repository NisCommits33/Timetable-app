/**
 * Analytics Utility Module
 * Calculate statistics and insights from tasks
 */

/**
 * Calculate completion rate for a date range
 * @param {Array} tasks - All tasks
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} - Completion statistics
 */
export const calculateCompletionRate = (tasks, startDate, endDate) => {
    const tasksInRange = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= startDate && taskDate <= endDate;
    });

    const completed = tasksInRange.filter(t => t.completed).length;
    const total = tasksInRange.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;

    return {
        completed,
        pending: total - completed,
        total,
        rate: Math.round(rate * 10) / 10
    };
};

/**
 * Get tasks grouped by category with time spent
 * @param {Array} tasks - All tasks
 * @returns {Object} - Category breakdown
 */
export const getTimeByCategory = (tasks) => {
    const categories = {};

    tasks.forEach(task => {
        const category = task.category || 'other';
        if (!categories[category]) {
            categories[category] = {
                name: category,
                count: 0,
                completed: 0,
                totalTime: 0,
                estimatedTime: 0
            };
        }

        categories[category].count++;
        if (task.completed) categories[category].completed++;
        categories[category].totalTime += task.timeTracking?.totalTimeSpent || 0;
        categories[category].estimatedTime += task.estimatedDuration || 0;
    });

    return Object.values(categories).map(cat => ({
        ...cat,
        totalTimeHours: Math.round((cat.totalTime / 3600000) * 10) / 10,
        estimatedTimeHours: Math.round((cat.estimatedTime / 3600) * 10) / 10,
        completionRate: cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0
    }));
};

/**
 * Get tasks by priority
 * @param {Array} tasks - All tasks
 * @returns {Object} - Priority breakdown
 */
export const getTasksByPriority = (tasks) => {
    const priorities = { high: 0, medium: 0, low: 0 };
    const completed = { high: 0, medium: 0, low: 0 };

    tasks.forEach(task => {
        const priority = task.priority || 'medium';
        priorities[priority]++;
        if (task.completed) completed[priority]++;
    });

    return {
        high: { total: priorities.high, completed: completed.high, rate: priorities.high > 0 ? Math.round((completed.high / priorities.high) * 100) : 0 },
        medium: { total: priorities.medium, completed: completed.medium, rate: priorities.medium > 0 ? Math.round((completed.medium / priorities.medium) * 100) : 0 },
        low: { total: priorities.low, completed: completed.low, rate: priorities.low > 0 ? Math.round((completed.low / priorities.low) * 100) : 0 }
    };
};

/**
 * Calculate productivity trend over time
 * @param {Array} tasks - All tasks
 * @param {number} days - Number of days to analyze
 * @returns {Array} - Daily productivity data
 */
export const getProductivityTrend = (tasks, days = 7) => {
    const trend = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayTasks = tasks.filter(t => t.date === dateStr);
        const completed = dayTasks.filter(t => t.completed).length;

        trend.push({
            date: dateStr,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            total: dayTasks.length,
            completed,
            pending: dayTasks.length - completed,
            rate: dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0
        });
    }

    return trend;
};

/**
 * Find most productive time of day
 * @param {Array} tasks - Completed tasks
 * @returns {Object} - Time of day analysis
 */
export const getMostProductiveHours = (tasks) => {
    const completedTasks = tasks.filter(t => t.completed);
    const timeSlots = {
        morning: { label: 'Morning (5AM-12PM)', count: 0, tasks: [] },
        afternoon: { label: 'Afternoon (12PM-5PM)', count: 0, tasks: [] },
        evening: { label: 'Evening (5PM-9PM)', count: 0, tasks: [] },
        night: { label: 'Night (9PM-5AM)', count: 0, tasks: [] }
    };

    completedTasks.forEach(task => {
        if (!task.startTime) return;

        const hour = parseInt(task.startTime.split(':')[0]);
        let slot;

        if (hour >= 5 && hour < 12) slot = 'morning';
        else if (hour >= 12 && hour < 17) slot = 'afternoon';
        else if (hour >= 17 && hour < 21) slot = 'evening';
        else slot = 'night';

        timeSlots[slot].count++;
        timeSlots[slot].tasks.push(task);
    });

    const mostProductive = Object.entries(timeSlots)
        .sort(([, a], [, b]) => b.count - a.count)[0];

    return {
        timeSlots,
        mostProductive: {
            slot: mostProductive[0],
            ...mostProductive[1]
        }
    };
};

/**
 * Get weekly summary statistics
 * @param {Array} tasks - All tasks
 * @returns {Object} - Weekly stats
 */
export const getWeeklySummary = (tasks) => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)

    const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= weekStart && taskDate <= today;
    });

    const completed = weekTasks.filter(t => t.completed).length;
    const totalTime = weekTasks.reduce((sum, task) =>
        sum + (task.timeTracking?.totalTimeSpent || 0), 0
    );

    return {
        total: weekTasks.length,
        completed,
        pending: weekTasks.length - completed,
        completionRate: weekTasks.length > 0 ? Math.round((completed / weekTasks.length) * 100) : 0,
        totalTimeHours: Math.round((totalTime / 3600000) * 10) / 10,
        averagePerDay: Math.round((weekTasks.length / 7) * 10) / 10
    };
};

/**
 * Get overdue tasks
 * @param {Array} tasks - All tasks
 * @returns {Array} - Overdue tasks
 */
export const getOverdueTasks = (tasks) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return tasks.filter(task => {
        if (task.completed) return false;

        const taskDate = new Date(task.date);
        if (taskDate < today) return true;

        if (taskDate.toDateString() === today.toDateString()) {
            const [hours, minutes] = task.endTime.split(':').map(Number);
            const taskEndTime = new Date(today);
            taskEndTime.setHours(hours, minutes, 0, 0);
            return now > taskEndTime;
        }

        return false;
    });
};

/**
 * Calculate average task duration
 * @param {Array} tasks - Completed tasks
 * @returns {Object} - Duration statistics
 */
export const getAverageDuration = (tasks) => {
    const completedTasks = tasks.filter(t => t.completed && t.timeTracking?.totalTimeSpent);

    if (completedTasks.length === 0) {
        return { averageHours: 0, averageMinutes: 0, totalHours: 0, count: 0 };
    }

    const totalTime = completedTasks.reduce((sum, task) =>
        sum + (task.timeTracking?.totalTimeSpent || 0), 0
    );

    const average = totalTime / completedTasks.length;

    return {
        averageHours: Math.round((average / 3600000) * 10) / 10,
        averageMinutes: Math.round((average / 60000)),
        totalHours: Math.round((totalTime / 3600000) * 10) / 10,
        count: completedTasks.length
    };
};

/**
 * Get overall task completion rate
 * @param {Array} tasks - All tasks
 * @returns {number} - Completion rate percentage
 */
export const getTaskCompletionRate = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
};

/**
 * Get current streak of consecutive days with completed tasks
 * @param {Array} tasks - All tasks
 * @returns {number} - Streak count
 */
export const getStreakCount = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;

    // Get unique dates with completions
    const completionDates = [...new Set(tasks
        .filter(t => t.completed)
        .map(t => t.date))]
        .sort((a, b) => new Date(b) - new Date(a));

    if (completionDates.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if the latest completion was today or yesterday to start streak
    if (completionDates[0] !== today && completionDates[0] !== yesterday) {
        return 0;
    }

    let currentDate = new Date(completionDates[0]);
    for (const dateStr of completionDates) {
        const date = new Date(dateStr);
        const diff = (currentDate - date) / (1000 * 60 * 60 * 24);

        if (diff <= 1) {
            streak++;
            currentDate = date;
        } else {
            break;
        }
    }

    return streak;
};

export default {
    calculateCompletionRate,
    getTimeByCategory,
    getTasksByPriority,
    getProductivityTrend,
    getMostProductiveHours,
    getWeeklySummary,
    getOverdueTasks,
    getAverageDuration,
    getTaskCompletionRate,
    getStreakCount
};
