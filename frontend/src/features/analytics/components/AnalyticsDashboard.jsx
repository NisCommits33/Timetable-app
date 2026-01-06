import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    BarChart3,
    PieChart,
    Target,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    Filter,
    Download,
    Info,
    Sparkles,
    Activity,
    Smartphone,
    Layout
} from 'lucide-react';
import {
    getWeeklySummary,
    getTimeByCategory,
    getTasksByPriority,
    getProductivityTrend,
    getMostProductiveHours,
    getOverdueTasks,
    getAverageDuration,
    getTaskCompletionRate,
    getStreakCount
} from '../../../utils/analyticsUtils';

const AnalyticsDashboard = ({ tasks, isDarkMode }) => {
    const [timeRange, setTimeRange] = useState('week');
    const [hoveredMetric, setHoveredMetric] = useState(null);

    const stats = useMemo(() => ({
        weekly: getWeeklySummary(tasks),
        byCategory: getTimeByCategory(tasks),
        byPriority: getTasksByPriority(tasks),
        trend: getProductivityTrend(tasks, 7),
        productive: getMostProductiveHours(tasks),
        overdue: getOverdueTasks(tasks),
        duration: getAverageDuration(tasks),
        completionRate: getTaskCompletionRate(tasks),
        streak: getStreakCount(tasks)
    }), [tasks]);

    // Enhanced color system with premium tokens
    const colorClasses = {
        blue: {
            text: 'text-blue-600 dark:text-blue-400',
            bgBar: 'bg-gradient-to-t from-blue-600 to-blue-400',
            accent: 'bg-blue-500/10 border-blue-500/20'
        },
        green: {
            text: 'text-emerald-600 dark:text-emerald-400',
            bgBar: 'bg-gradient-to-t from-emerald-600 to-emerald-400',
            accent: 'bg-emerald-500/10 border-emerald-500/20'
        },
        red: {
            text: 'text-rose-600 dark:text-rose-400',
            bgBar: 'bg-gradient-to-t from-rose-600 to-rose-400',
            accent: 'bg-rose-500/10 border-rose-500/20'
        },
        purple: {
            text: 'text-violet-600 dark:text-violet-400',
            bgBar: 'bg-gradient-to-t from-violet-600 to-violet-400',
            accent: 'bg-violet-500/10 border-violet-500/20'
        },
        amber: {
            text: 'text-amber-600 dark:text-amber-400',
            bgBar: 'bg-gradient-to-t from-amber-600 to-amber-400',
            accent: 'bg-amber-500/10 border-amber-500/20'
        },
        indigo: {
            text: 'text-brand-600 dark:text-brand-400',
            bgBar: 'bg-gradient-to-t from-brand-600 to-brand-400',
            accent: 'bg-brand-500/10 border-brand-500/20'
        }
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend, insight, index = 0 }) => {
        const colors = colorClasses[color] || colorClasses.blue;
        const isPositive = trend?.direction === 'up';

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="glass-card p-6 relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300"
            >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                    <Icon size={120} />
                </div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2.5 rounded-xl ${colors.accent} border shadow-sm`}>
                                <Icon className={`h-5 w-5 ${colors.text}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-surface-400">
                                {title}
                            </span>
                        </div>
                        <div className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-1">
                            {value}
                        </div>
                        {subtitle && (
                            <div className="text-xs font-medium text-surface-500 dark:text-surface-500">
                                {subtitle}
                            </div>
                        )}
                    </div>

                    {trend && (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isPositive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {trend.value}
                        </div>
                    )}
                </div>

                {insight && (
                    <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2">
                        <Sparkles size={12} className="text-brand-500" />
                        <span className="text-[10px] font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">{insight}</span>
                    </div>
                )}
            </motion.div>
        );
    };

    const ProgressBar = ({ value, max, color = 'blue', label }) => {
        const colors = colorClasses[color] || colorClasses.blue;
        const percentage = max > 0 ? (value / max) * 100 : 0;

        return (
            <div className="space-y-3 group">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-surface-400 dark:text-surface-500">
                            {label}
                        </span>
                        <div className="text-sm font-bold text-surface-900 dark:text-white">
                            {value} <span className="text-surface-400 font-medium">/ {max}</span>
                        </div>
                    </div>
                    <div className={`text-sm font-black ${colors.text} tabular-nums`}>
                        {Math.round(percentage)}%
                    </div>
                </div>
                <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800/50 overflow-hidden border border-black/5 dark:border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className={`h-full rounded-full ${colors.bgBar} shadow-sm group-hover:brightness-110 transition-all`}
                    />
                </div>
            </div>
        );
    };

    if (!tasks || tasks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[400px] glass-card"
            >
                <div className="p-6 rounded-3xl bg-surface-100 dark:bg-surface-800 mb-6">
                    <Activity className="h-12 w-12 text-surface-400" />
                </div>
                <h3 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">Awaiting Data</h3>
                <p className="text-surface-500 text-center max-w-xs font-medium">
                    Your productivity insights will appear here once you start completing tasks.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-10 p-2 sm:p-4 lg:p-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
                <div>
                    <h2 className="text-3xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-3">
                        Performance Insights
                        <div className="px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black uppercase tracking-widest text-brand-600">Live Engine</div>
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 font-medium flex items-center gap-2 mt-1.5">
                        <Sparkles className="h-4 w-4 text-brand-500 animate-pulse" />
                        Visualizing your weekly productivity trajectory
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-1 rounded-xl bg-surface-100/50 dark:bg-surface-800/50 border border-black/5 dark:border-white/5 backdrop-blur-sm flex">
                        {['week', 'month'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${timeRange === range
                                    ? 'bg-white dark:bg-surface-700 text-brand-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                    : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="premium-button py-2 px-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                        <Download size={14} />
                        Report
                    </button>
                </div>
            </div>

            {/* Top Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    index={0}
                    icon={CheckCircle2}
                    title="Completion Rate"
                    value={`${stats.completionRate}%`}
                    subtitle={`${stats.weekly.completed}/${stats.weekly.total} Tasks Done`}
                    color="green"
                    trend={{ value: "+4.2%", direction: "up" }}
                    insight="Strong Momentum"
                />
                <StatCard
                    index={1}
                    icon={Clock}
                    title="Focus Average"
                    value={`${stats.duration.averageHours}h`}
                    subtitle={`${stats.duration.count} Sync Sessions`}
                    color="blue"
                    trend={{ value: "-8m", direction: "down" }}
                    insight="Gaining Speed"
                />
                <StatCard
                    index={2}
                    icon={Target}
                    title="Active Streak"
                    value={`${stats.streak}d`}
                    subtitle="Consistency Flow"
                    color="purple"
                    trend={{ value: "+2d", direction: "up" }}
                    insight="Elite Focus"
                />
                <StatCard
                    index={3}
                    icon={AlertCircle}
                    title="Pending Items"
                    value={stats.overdue.length}
                    subtitle="Attention Required"
                    color={stats.overdue.length > 3 ? "red" : "amber"}
                    insight={stats.overdue.length > 3 ? "Action Required" : "Manageable"}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Productivity Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="xl:col-span-2 glass-card p-8"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                                <TrendingUp className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">Productivity Trend</h3>
                                <p className="text-sm text-surface-500 dark:text-surface-400 font-medium tracking-tight">Weekly performance cycle</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4 items-end min-h-[220px] px-2">
                        {stats.trend.map((day, index) => {
                            const barHeight = Math.max(15, (day.rate / 100) * 180);
                            return (
                                <div key={day.date} className="group relative flex flex-col items-center">
                                    {/* Tooltip */}
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 z-50 pointer-events-none">
                                        <div className="bg-surface-900 dark:bg-surface-800 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl border border-white/10 uppercase tracking-widest whitespace-nowrap">
                                            {day.completed} / {day.total} Tasks
                                        </div>
                                        <div className="w-2.5 h-2.5 bg-surface-900 dark:bg-surface-800 rotate-45 mx-auto -mt-1.5" />
                                    </div>

                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: barHeight }}
                                        transition={{ delay: index * 0.05, duration: 1, ease: [0.33, 1, 0.68, 1] }}
                                        className={`w-full max-w-[48px] rounded-2xl relative overflow-hidden transition-all duration-300 shadow-sm ${day.rate > 80 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' :
                                            day.rate > 50 ? 'bg-gradient-to-t from-brand-600 to-brand-400' :
                                                'bg-gradient-to-t from-surface-300 to-surface-200 dark:from-surface-700 dark:to-surface-600'
                                            }`}
                                    />

                                    <div className="mt-5 text-center">
                                        <span className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest block mb-1">
                                            {day.day.slice(0, 3)}
                                        </span>
                                        <div className={`text-xs font-bold ${day.rate > 0 ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-surface-700'}`}>
                                            {day.rate}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Distribution Overview */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-8 flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                            <PieChart className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">Distribution</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400 font-medium tracking-tight">Categorical breakdown</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {stats.byCategory.map((cat, idx) => {
                            const colors = ['blue', 'green', 'purple', 'red', 'amber', 'indigo'];
                            return (
                                <ProgressBar
                                    key={cat.name}
                                    value={cat.completed}
                                    max={cat.count}
                                    color={colors[idx % colors.length]}
                                    label={cat.name}
                                />
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Peak Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-8"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">Peak Cycles</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400 font-medium tracking-tight">Time-of-day efficiency</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3 items-end h-[160px] mb-8">
                        {Object.entries(stats.productive.timeSlots).map(([slot, data], index) => {
                            const isPeak = slot === stats.productive.mostProductive.slot;
                            const height = Math.max(15, (data.count / Math.max(...Object.values(stats.productive.timeSlots).map(d => d.count)) * 140));
                            return (
                                <div key={slot} className="flex flex-col items-center group relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: height }}
                                        transition={{ delay: index * 0.05, duration: 0.8 }}
                                        className={`w-full max-w-[32px] rounded-xl transition-all duration-300 ${isPeak
                                            ? 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-lg ring-2 ring-amber-500/20'
                                            : 'bg-surface-200 dark:bg-surface-800'
                                            }`}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 dark:text-surface-500 mt-4">
                                        {data.label.split(' ')[0]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shadow-sm">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-surface-900 dark:text-white">Peak Discovery: {stats.productive.mostProductive.label}</div>
                            <p className="text-xs text-surface-500 font-medium">Schedule deep work during this window for max output.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Priority Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-8"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                            <Layout className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">Priority Scan</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400 font-medium tracking-tight">Criticality distribution</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-10">
                        {[
                            { level: 'High', data: stats.byPriority.high, color: 'red' },
                            { level: 'Medium', data: stats.byPriority.medium, color: 'amber' },
                            { level: 'Low', data: stats.byPriority.low, color: 'green' }
                        ].map(({ level, data, color }) => (
                            <div key={level} className="text-center group">
                                <div className={`text-3xl font-display font-black mb-1 ${colorClasses[color].text}`}>
                                    {data.rate}%
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-surface-400 dark:text-surface-500 mb-1">
                                    {level} Priority
                                </div>
                                <div className="text-[10px] font-bold text-surface-500 tabular-nums">
                                    {data.completed}/{data.total}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <ProgressBar value={stats.byPriority.high.completed} max={stats.byPriority.high.total} color="red" label="Critical Paths" />
                        <ProgressBar value={stats.byPriority.medium.completed} max={stats.byPriority.medium.total} color="amber" label="Strategic Tasks" />
                    </div>
                </motion.div>
            </div>

            {/* Personalized Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: TrendingUp,
                        title: "Performance Meta",
                        text: `Your completion rate is ${stats.completionRate}%, exceeding last week's average.`,
                        color: "brand"
                    },
                    {
                        icon: Clock,
                        title: "Focus Window",
                        text: `Target deep work sessions around ${stats.productive.mostProductive.label} for peak flow.`,
                        color: "amber"
                    },
                    {
                        icon: Sparkles,
                        title: "Quick Victory",
                        text: "Close 2 low-priority tasks today to clear your mental bandwidth.",
                        color: "emerald"
                    }
                ].map((insight, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 border-brand-500/10"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <insight.icon className={`h-5 w-5 text-${insight.color}-500`} />
                            <h4 className="text-xs font-black uppercase tracking-widest text-surface-900 dark:text-white">{insight.title}</h4>
                        </div>
                        <p className="text-sm font-medium text-surface-500 dark:text-surface-400 leading-relaxed">
                            {insight.text}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;