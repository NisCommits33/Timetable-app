import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Sun, Moon, Target, LayoutDashboard, Sparkles, Clock } from 'lucide-react';
import NotificationCenter from '../features/notifications/components/NotificationCenter';

const Navbar = ({ isDarkMode, toggleDarkMode, showFocusTimer, setShowFocusTimer }) => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="sticky top-0 z-50 py-3 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="glass-nav rounded-2xl px-6 h-16 flex items-center justify-between shadow-glass">
                    {/* Logo */}
                    <div className="flex items-center space-x-10">
                        <NavLink to="/" className="flex items-center space-x-3 group transition-all duration-300">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative bg-brand-600 p-2 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-display font-bold bg-gradient-to-r from-surface-900 to-surface-700 dark:from-white dark:to-surface-300 bg-clip-text text-transparent">
                                Timetable
                            </span>
                        </NavLink>

                        {/* Nav Links */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {[
                                { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                                { to: '/schedule', label: 'Schedule', icon: Clock },
                                { to: '/features', label: 'Features', icon: Sparkles },
                            ].map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => `
                                        relative group flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300
                                        ${isActive
                                            ? 'text-brand-600 dark:text-brand-400'
                                            : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-surface-800/50'
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <link.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-500' : ''}`} />
                                            <span>{link.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-pill"
                                                    className="absolute inset-0 bg-brand-500/5 dark:bg-brand-500/10 rounded-xl -z-10"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Dark Mode Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleDarkMode}
                            className={`p-2.5 rounded-xl transition-colors duration-300 ${isDarkMode
                                ? 'bg-surface-800 text-amber-400 hover:bg-surface-700'
                                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                } border border-transparent dark:border-surface-700`}
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </motion.button>

                        {/* Focus Timer Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFocusTimer(!showFocusTimer)}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${showFocusTimer
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                                : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                                } border border-transparent dark:border-surface-700`}
                        >
                            <Target className={`h-5 w-5 ${showFocusTimer ? 'animate-pulse' : ''}`} />
                        </motion.button>

                        <div className="h-4 w-px bg-surface-200 dark:bg-surface-700 mx-1" />

                        <NotificationCenter isDarkMode={isDarkMode} />
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Navbar;
