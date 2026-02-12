import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import FocusTimer from '../features/timer/components/FocusTimer';

const MainLayout = ({
    children,
    isDarkMode,
    toggleDarkMode,
    showFocusTimer,
    setShowFocusTimer,
    onSignOut
}) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
            }`}>
            {/* Desktop Navbar */}
            {!isLoginPage && (
                <div className="hidden md:block">
                    <Navbar
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        showFocusTimer={showFocusTimer}
                        setShowFocusTimer={setShowFocusTimer}
                        onSignOut={onSignOut}
                    />
                </div>
            )}

            {/* Mobile Header (Minimal) */}
            {!isLoginPage && (
                <div className="md:hidden flex items-center justify-between px-6 py-4 sticky top-0 z-40 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xl font-display font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Timetable
                    </span>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                        {isDarkMode ? '🌙' : '☀️'}
                    </button>
                </div>
            )}

            <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isLoginPage ? 'py-8' : 'pt-4 pb-24 md:py-8'} relative`}>
                {children}

                {/* Floating Focus Timer overlay */}
                {showFocusTimer && !isLoginPage && (
                    <div className="fixed bottom-24 right-6 md:bottom-6 md:right-6 w-80 z-50 animate-fadeIn shadow-2xl scale-90 md:scale-100 origin-bottom-right">
                        <FocusTimer
                            isDarkMode={isDarkMode}
                            onClose={() => setShowFocusTimer(false)}
                        />
                    </div>
                )}
            </main>

            {/* Mobile Bottom Nav */}
            {!isLoginPage && <BottomNav />}
        </div>
    );
};

export default MainLayout;
