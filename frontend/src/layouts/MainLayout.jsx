import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
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
            {!isLoginPage && (
                <Navbar
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    showFocusTimer={showFocusTimer}
                    setShowFocusTimer={setShowFocusTimer}
                    onSignOut={onSignOut}
                />
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                {children}

                {/* Floating Focus Timer overlay */}
                {showFocusTimer && !isLoginPage && (
                    <div className="fixed bottom-6 right-6 w-80 z-50 animate-fadeIn shadow-2xl">
                        <FocusTimer
                            isDarkMode={isDarkMode}
                            onClose={() => setShowFocusTimer(false)}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default MainLayout;
