/**
 * AnalyticsDashboard Component
 * Display task statistics and insights
 */

import { useMemo } from 'react';
import {
    TrendingUp,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    BarChart3,
    PieChart,
    Target
} from 'lucide-react';
import {
    getWeeklySummary,
    getTimeByCategory,
    getTasksByPriority,
    getProductivityTrend,
    getMostProductiveHours,
    getOverdueTasks,
    getAverageDuration
} from '../utils/analyticsUtils';

const AnalyticsDashboard = ({ tasks, isDarkMode }) => {
    const stats = useMemo(() => ({
        weekly: getWeeklySummary(tasks),
        byCategory: getTimeByCategory(tasks),
        byPriority: getTasksByPriority(tasks),
        trend: getProductivityTrend(tasks, 7),
        productive: getMostProductiveHours(tasks),
        overdue: getOverdueTasks(tasks),
        duration: getAverageDuration(tasks)
    }), [tasks]);

    // Color mapping for Tailwind classes (must use full class names for JIT)
    const colorClasses = {
        blue: {
            bg: 'bg-blue-100',
            bgDark: 'dark:bg-blue-900/20',
            text: 'text-blue-600',
            bgBar: 'bg-blue-600'
        },
        green: {
            bg: 'bg-green-100',
            bgDark: 'dark:bg-green-900/20',
            text: 'text-green-600',
            bgBar: 'bg-green-600'
        },
        red: {
            bg: 'bg-red-100',
            bgDark: 'dark:bg-red-900/20',
            text: 'text-red-600',
            bgBar: 'bg-red-600'
        },
        purple: {
            bg: 'bg-purple-100',
            bgDark: 'dark:bg-purple-900/20',
            text: 'text-purple-600',
            bgBar: 'bg-purple-600'
        },
        yellow: {
            bg: 'bg-yellow-100',
            bgDark: 'dark:bg-yellow-900/20',
            text: 'text-yellow-600',
            bgBar: 'bg-yellow-600'
        },
        pink: {
            bg: 'bg-pink-100',
            bgDark: 'dark:bg-pink-900/20',
            text: 'text-pink-600',
            bgBar: 'bg-pink-600'
        },
        gray: {
            bg: 'bg-gray-100',
            bgDark: 'dark:bg-gray-900/20',
            text: 'text-gray-600',
            bgBar: 'bg-gray-600'
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => {
        const colors = colorClasses[color] || colorClasses.blue;
        return (
            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-start justify-between">
                    <div>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {title}
                        </div>
                        <div className="text-3xl font-bold">{value}</div>
                        {subtitle && (
                            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                {subtitle}
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg ${colors.bg} ${colors.bgDark}`}>
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                </div>
                {trend && (
                    <div className={`mt-3 flex items-center text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {trend.value}
                    </div>
                )}
            </div>
        );
    };

    const ProgressBar = ({ value, max, color = 'blue', label }) => {
        const colors = colorClasses[color] || colorClasses.blue;
        return (
            <div>
                {label && (
                    <div className="flex justify-between text-sm mb-2">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{label}</span>
                        <span className="font-medium">{value}/{max}</span>
                    </div>
                )}
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                        className={`h-full rounded-full ${colors.bgBar} transition-all`}
                        style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Insights and statistics about your tasks
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={CheckCircle2}
                    title="This Week"
                    value={stats.weekly.completed}
                    subtitle={`${stats.weekly.completionRate}% completion rate`}
                    color="green"
                />
                <StatCard
                    icon={Clock}
                    title="Time Tracked"
                    value={`${stats.weekly.totalTimeHours}h`}
                    subtitle="This week"
                    color="blue"
                />
                <StatCard
                    icon={AlertCircle}
                    title="Overdue"
                    value={stats.overdue.length}
                    subtitle="Tasks need attention"
                    color="red"
                />
                <StatCard
                    icon={Target}
                    title="Avg Duration"
                    value={`${stats.duration.averageHours}h`}
                    subtitle={`${stats.duration.count} completed tasks`}
                    color="purple"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productivity Trend */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center space-x-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">7-Day Productivity</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.trend.map((day) => (
                            <div key={day.date}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {day.day}
                                    </span>
                                    <span className="font-medium">{day.rate}%</span>
                                </div>
                                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all"
                                        style={{ width: `${day.rate}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center space-x-2 mb-4">
                        <PieChart className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold">By Category</h3>
                    </div>
                    <div className="space-y-4">
                        {stats.byCategory.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="capitalize">{cat.name}</span>
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {cat.completed}/{cat.count}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={cat.completed}
                                    max={cat.count}
                                    color={
                                        cat.name === 'work' ? 'blue' :
                                            cat.name === 'fitness' ? 'green' :
                                                cat.name === 'learning' ? 'purple' :
                                                    cat.name === 'personal' ? 'pink' : 'gray'
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Priority and Time Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority Breakdown */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <h3 className="font-semibold mb-4">Priority Breakdown</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-red-600 font-medium">🔴 High Priority</span>
                                <span>{stats.byPriority.high.rate}%</span>
                            </div>
                            <ProgressBar
                                value={stats.byPriority.high.completed}
                                max={stats.byPriority.high.total}
                                color="red"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-yellow-600 font-medium">🟡 Medium Priority</span>
                                <span>{stats.byPriority.medium.rate}%</span>
                            </div>
                            <ProgressBar
                                value={stats.byPriority.medium.completed}
                                max={stats.byPriority.medium.total}
                                color="yellow"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-green-600 font-medium">🟢 Low Priority</span>
                                <span>{stats.byPriority.low.rate}%</span>
                            </div>
                            <ProgressBar
                                value={stats.byPriority.low.completed}
                                max={stats.byPriority.low.total}
                                color="green"
                            />
                        </div>
                    </div>
                </div>

                {/* Most Productive Time */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <h3 className="font-semibold mb-4">Most Productive Time</h3>
                    <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                        }`}>
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {stats.productive.mostProductive.label}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stats.productive.mostProductive.count} tasks completed
                        </div>
                    </div>
                    <div className="space-y-2">
                        {Object.entries(stats.productive.timeSlots).map(([slot, data]) => (
                            <div
                                key={slot}
                                className={`flex justify-between p-2 rounded ${slot === stats.productive.mostProductive.slot
                                        ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                        : ''
                                    }`}
                            >
                                <span className="text-sm">{data.label}</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {data.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overdue Tasks */}
            {stats.overdue.length > 0 && (
                <div className={`p-6 rounded-xl border border-red-200 ${isDarkMode ? 'bg-red-900/10' : 'bg-red-50'
                    }`}>
                    <div className="flex items-center space-x-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold text-red-900 dark:text-red-200">
                            Overdue Tasks ({stats.overdue.length})
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {stats.overdue.slice(0, 5).map(task => (
                            <div
                                key={task.id}
                                className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                            >
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-red-600">
                                    Due: {task.date} at {task.endTime}
                                </div>
                            </div>
                        ))}
                        {stats.overdue.length > 5 && (
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                +{stats.overdue.length - 5} more overdue tasks
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
