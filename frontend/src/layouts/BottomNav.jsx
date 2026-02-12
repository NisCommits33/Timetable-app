import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clock, Flame, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const navItems = [
        { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { to: '/schedule', label: 'Schedule', icon: Clock },
        { to: '/habits', label: 'Habits', icon: Flame },
        { to: '/features', label: 'Pro', icon: Sparkles },
        { to: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `
                            relative flex flex-col items-center gap-1 p-2 transition-all duration-200
                            ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`h-6 w-6 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute -top-2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
