import React, { useState } from 'react';
import { 
  Bell, X, Clock, AlertCircle, CheckCircle, Calendar, Settings, Check, 
  Play, Square, Target, AlertTriangle, Trophy // ADD THESE
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationSettings from './NotificationSettings';

const NotificationCenter = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

const getNotificationIcon = (type) => {
  switch (type) {
    case 'reminder': return <Clock className="h-4 w-4 text-blue-500" />;
    case 'overdue': return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'progress': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'schedule': return <Calendar className="h-4 w-4 text-purple-500" />;
    case 'break': return <Clock className="h-4 w-4 text-orange-500" />;
    // ADD THESE NEW ICONS FOR TIME TRACKING:
    case 'timer_start': return <Play className="h-4 w-4 text-green-500" />;
    case 'timer_stop': return <Square className="h-4 w-4 text-red-500" />;
    case 'time_milestone': return <Target className="h-4 w-4 text-yellow-500" />;
    case 'overtime': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'goal_reached': return <Trophy className="h-4 w-4 text-green-500" />;
    default: return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <>
      <div className="relative">
        {/* Notification Bell */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {isOpen && (
          <div className={`absolute right-0 top-12 w-96 rounded-lg shadow-xl border z-50 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className={`p-1 rounded ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className={`text-xs ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={clearAll}
                      className={`text-xs ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Clear all
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                  <p className="text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b transition-colors cursor-pointer ${
                      notification.read 
                        ? isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        : isDarkMode ? 'bg-blue-900/20 border-gray-700' : 'bg-blue-50 border-gray-200'
                    } ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {notification.message || notification.taskTitle}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {formatTime(notification.timestamp)}
                          </p>
                          {!notification.read && (
                            <div className="flex items-center space-x-1 text-blue-500 text-xs">
                              <Check className="h-3 w-3" />
                              <span>Unread</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <NotificationSettings 
        isDarkMode={isDarkMode} 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};

export default NotificationCenter;