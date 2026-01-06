import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, Clock, AlertCircle, CheckCircle, Calendar, Settings, Check,
  Play, Square, Target, AlertTriangle, Trophy, ChevronRight
} from 'lucide-react';
import { useNotifications } from '../../../providers/NotificationProvider';
import NotificationSettings from './NotificationSettings';

const NotificationCenter = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' | 'settings'
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case 'progress': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'schedule': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'break': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'timer_start': return <Play className="h-4 w-4 text-emerald-500" />;
      case 'timer_stop': return <Square className="h-4 w-4 text-rose-500" />;
      case 'time_milestone': return <Target className="h-4 w-4 text-amber-500" />;
      case 'overtime': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'goal_reached': return <Trophy className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-surface-500" />;
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

  const overlayVariants = {
    closed: { opacity: 0, pointerEvents: 'none' },
    open: { opacity: 1, pointerEvents: 'auto' }
  };

  const drawerVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 group ${isOpen
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
          : isDarkMode
            ? 'bg-surface-800 text-surface-400 hover:bg-surface-700 hover:text-white'
            : 'bg-surface-100 text-surface-600 hover:bg-surface-200 hover:text-surface-900'
          }`}
      >
        <Bell className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md ring-2 ring-surface-50 dark:ring-surface-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/20 dark:bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-l border-white/20 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="shrink-0 p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/20 text-white">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white">
                      {activeTab === 'settings' ? 'Preferences' : 'Notifications'}
                    </h2>
                    <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
                      {activeTab === 'settings' ? 'Configure alerts' : `${unreadCount} unread updates`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-surface-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="shrink-0 px-6 pt-4 pb-2 flex gap-2">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'notifications'
                    ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white'
                    : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                    }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings'
                    ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white'
                    : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                    }`}
                >
                  Settings
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'notifications' ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
                            <CheckCircle size={32} className="text-brand-500 opacity-50" />
                          </div>
                          <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-1">All Caught Up</h3>
                          <p className="text-xs text-surface-500 max-w-[200px]">
                            You have cleared all your notifications. Time to focus!
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-end gap-2 mb-2">
                            <button
                              onClick={markAllAsRead}
                              className="text-[10px] font-bold uppercase tracking-widest text-brand-500 hover:text-brand-600"
                            >
                              Read All
                            </button>
                            <span className="text-surface-300 dark:text-surface-700">•</span>
                            <button
                              onClick={clearAll}
                              className="text-[10px] font-bold uppercase tracking-widest text-surface-400 hover:text-surface-600"
                            >
                              Clear
                            </button>
                          </div>

                          <div className="space-y-3">
                            {notifications.map((notif, i) => (
                              <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => markAsRead(notif.id)}
                                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${notif.read
                                  ? 'bg-transparent border-transparent hover:bg-surface-50 dark:hover:bg-surface-800/50'
                                  : 'bg-white dark:bg-surface-800 border-black/5 dark:border-white/5 shadow-lg shadow-black/5'
                                  }`}
                              >
                                {!notif.read && (
                                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
                                )}

                                <div className="flex gap-4">
                                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-surface-50 dark:bg-surface-900 border border-black/5 dark:border-white/5`}>
                                    {getNotificationIcon(notif.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold mb-1 line-clamp-2 ${notif.read ? 'text-surface-500 dark:text-surface-400' : 'text-surface-900 dark:text-white'}`}>
                                      {notif.message || notif.taskTitle}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-medium text-surface-400 uppercase tracking-wide">
                                        {formatTime(notif.timestamp)}
                                      </span>
                                      {notif.taskTitle && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-surface-300" />
                                          <span className="text-[10px] font-medium text-brand-500 line-clamp-1">
                                            {notif.taskTitle}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <NotificationSettings isDarkMode={isDarkMode} isOpen={true} inline={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;