import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
    Plus,
    Zap,
    Calendar,
    Clock,
    MapPin,
    ArrowRight,
    Sparkles,
    Ticket,
    CheckCircle2,
    TrendingUp,
    Activity,
    Brain,
    Coffee
} from 'lucide-react';
import AnalyticsDashboard from '../features/analytics/components/AnalyticsDashboard';
import { getTaskCompletionRate, getStreakCount } from '../utils/analyticsUtils';

// 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [2, -2]);
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    return (
        <motion.div
            style={{ rotateX, rotateY, perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Greeting Component
const GreetingHeader = ({ name = "Commander" }) => {
    const hours = new Date().getHours();
    let greeting = "Good Evening";
    let Icon = Sparkles;

    if (hours < 12) {
        greeting = "Good Morning";
        Icon = Coffee;
    } else if (hours < 18) {
        greeting = "Good Afternoon";
        Icon = Zap;
    }

    return (
        <div className="flex flex-col gap-1">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-surface-500 dark:text-surface-400 font-bold text-sm tracking-wide"
            >
                <Icon size={14} className="text-brand-500" />
                <span>{greeting}</span>
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-display font-black tracking-tighter text-surface-900 dark:text-white"
            >
                Ready for Impact?
            </motion.h1>
        </div>
    );
};

const DashboardPage = ({ tasks, isDarkMode, onAddTaskClick }) => {
    // Logic for Upcoming Events
    const upcomingEvents = tasks
        .filter(t => t.type === 'event' && !t.completed)
        .sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));

    const nextEvent = upcomingEvents[0];
    const subsequentEvents = upcomingEvents.slice(1, 3); // Show next 2 max for layout balance

    const getDaysLeft = (dateStr, timeStr) => {
        const eventDate = new Date(dateStr + 'T' + timeStr);
        const now = new Date();
        const diffTime = eventDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Quick Stats Logic
    const completionRate = getTaskCompletionRate(tasks);
    const streak = getStreakCount(tasks);
    const pendingCount = tasks.filter(t => !t.completed && t.type !== 'event').length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-12"
        >
            {/* Top Bar: Greeting & Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <GreetingHeader />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddTaskClick}
                    className="group relative overflow-hidden rounded-2xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 px-6 py-3 font-black tracking-wide shadow-xl shadow-brand-500/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2 text-sm">
                        <Plus size={18} />
                        <span>QUICK ADD</span>
                    </div>
                </motion.button>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[450px]">

                {/* MEGA BLOCK: Hero Event (Spans 8 cols) */}
                <TiltCard className="lg:col-span-8 h-full min-h-[400px]">
                    <div className="relative h-full bg-white dark:bg-surface-800 rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col justify-between group">

                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10" />
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-full blur-[80px]"
                        />

                        {nextEvent ? (
                            <>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-surface-300">Next Mission</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-display font-black text-surface-900 dark:text-white leading-[0.9] max-w-lg">
                                            {nextEvent.title}
                                        </h2>
                                        {nextEvent.location && (
                                            <div className="flex items-center gap-2 text-surface-500 font-bold text-sm">
                                                <MapPin size={16} className="text-brand-500" />
                                                {nextEvent.location}
                                            </div>
                                        )}
                                    </div>

                                    {/* Countdown Circle */}
                                    <div className="hidden sm:flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-surface-100 dark:border-surface-700 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm">
                                        <div className="text-4xl font-display font-black text-brand-600 dark:text-brand-400 leading-none">
                                            {getDaysLeft(nextEvent.date, nextEvent.startTime) <= 0 ? 'GO' : getDaysLeft(nextEvent.date, nextEvent.startTime)}
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-surface-400 text-center mt-1">
                                            {getDaysLeft(nextEvent.date, nextEvent.startTime) <= 0 ? 'Active' : 'Days Left'}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-auto pt-10">
                                    <div className="flex items-center gap-8 mb-6">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-1">Date</div>
                                            <div className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
                                                <Calendar size={18} className="text-purple-500" />
                                                {new Date(nextEvent.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="w-px h-8 bg-black/5 dark:bg-white/5" />
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-1">Time</div>
                                            <div className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
                                                <Clock size={18} className="text-purple-500" />
                                                {nextEvent.startTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-gradient-to-r from-brand-500 to-purple-600"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <Ticket size={48} className="mb-4" />
                                <h3 className="text-2xl font-black uppercase tracking-widest">All Clear</h3>
                                <p className="font-medium mt-2">No upcoming missions detected.</p>
                            </div>
                        )}
                    </div>
                </TiltCard>

                {/* SIDE COLUMN (Spans 4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">

                    {/* STAT BLOCK : High Impact */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 bg-surface-900 dark:bg-white rounded-3xl p-6 text-white dark:text-surface-900 relative overflow-hidden flex flex-col justify-between shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-white/10 dark:bg-black/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Completion Rate</div>
                                <div className="text-5xl font-display font-black tracking-tight">{completionRate}%</div>
                            </div>
                            <Activity className="opacity-50" />
                        </div>

                        <div className="relative z-10">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Active Streak</div>
                            <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold">{streak} Days</div>
                                <span className="text-xs px-1.5 py-0.5 bg-white/20 dark:bg-black/10 rounded font-black tracking-wide">FIRE</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* LIST BLOCK : On Deck */}
                    <div className="flex-[1.5] bg-white dark:bg-surface-800 rounded-3xl p-6 border border-black/5 dark:border-white/5 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-surface-500">On Deck</h3>
                            <span className="text-xs font-bold text-brand-500">{subsequentEvents.length} Pending</span>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                            {subsequentEvents.length > 0 ? (
                                subsequentEvents.map(evt => (
                                    <div key={evt.id} className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5 cursor-default">
                                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-100 dark:bg-surface-700 min-w-[48px]">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                                                {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                                            </span>
                                            <span className="text-lg font-black text-surface-900 dark:text-white leading-none">
                                                {new Date(evt.date).getDate()}
                                            </span>
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-sm text-surface-900 dark:text-white truncate">{evt.title}</h4>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-surface-400">
                                                <Clock size={10} />
                                                <span>{evt.startTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-30">
                                    <Coffee size={24} className="mb-2" />
                                    <span className="text-[10px] font-black uppercase">Relax</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                <div className="text-[10px] font-black uppercase tracking-widest text-surface-400 flex items-center gap-2">
                    <Brain size={12} />
                    <span>Neural Analytics</span>
                </div>
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
            </div>

            {/* Analytics Section */}
            <div className="glass-card overflow-hidden">
                <AnalyticsDashboard
                    tasks={tasks}
                    isDarkMode={isDarkMode}
                />
            </div>
        </motion.div>
    );
};

export default DashboardPage;
