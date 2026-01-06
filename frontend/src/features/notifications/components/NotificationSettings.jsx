import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Bell, Volume2, Moon, Sun, Clock,
  AlertCircle, ChevronRight, X, Headphones,
  Smartphone, Zap, Shield, Calendar, Brain,
  Check, VolumeX, PhoneOff, BellOff
} from 'lucide-react';
import { useNotifications } from '../../../providers/NotificationProvider';
import { REMINDER_TIMINGS } from '../../../utils/notificationTypes';

const NotificationSettings = ({ isDarkMode, isOpen, onClose, inline = false }) => {
  const { settings, setSettings } = useNotifications();
  const [activeTab, setActiveTab] = useState('general');

  if (!isOpen && !inline) return null;

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Enhanced toggle with better feedback
  const EnhancedToggle = ({ checked, onChange, icon: Icon, label, description, variant = 'default' }) => {
    const variants = {
      default: {
        base: 'brand',
        secondary: 'blue',
        gradient: 'from-brand-500 to-blue-600',
        light: 'bg-brand-500/10',
        border: 'border-brand-500/50'
      },
      critical: {
        base: 'rose',
        secondary: 'pink',
        gradient: 'from-rose-500 to-pink-600',
        light: 'bg-rose-500/10',
        border: 'border-rose-500/50'
      },
      success: {
        base: 'emerald',
        secondary: 'green',
        gradient: 'from-emerald-500 to-green-600',
        light: 'bg-emerald-500/10',
        border: 'border-emerald-500/50'
      },
      warning: {
        base: 'amber',
        secondary: 'orange',
        gradient: 'from-amber-500 to-orange-600',
        light: 'bg-amber-500/10',
        border: 'border-amber-500/50'
      }
    };

    const currentVariant = variants[variant] || variants.default;

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="group relative"
      >
        <div className={`
          relative ${inline ? 'p-3' : 'p-5'} rounded-2xl border-2 transition-all duration-300 overflow-hidden
          ${checked
            ? `border-transparent ${currentVariant.light} shadow-lg`
            : 'border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/30'
          }
          ${!checked && `hover:border-${currentVariant.base}-500/50 dark:hover:border-${currentVariant.base}-400/50`}
        `}>
          {/* Animated background - Subtle Gradient */}
          {checked && (
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${currentVariant.gradient}`} />
          )}

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`
                relative p-3 rounded-xl transition-all duration-300 flex-shrink-0
                ${checked
                  ? `bg-gradient-to-br ${currentVariant.gradient} text-white shadow-md`
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-200'
                }
              `}>
                <Icon size={20} />
                {checked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Check size={10} className={`text-${currentVariant.base}-600`} />
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2">
                  <span className="truncate">{label}</span>
                  {checked && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      className={`text-[10px] font-black uppercase tracking-widest bg-white/50 dark:bg-black/20 text-${currentVariant.base}-600 dark:text-${currentVariant.base}-400 px-2 py-0.5 rounded-full flex-shrink-0`}
                    >
                      On
                    </motion.span>
                  )}
                </div>
                {!inline && (
                  <div className="text-xs text-surface-500 dark:text-surface-400 mt-1 max-w-xs truncate">
                    {description}
                  </div>
                )}
              </div>
            </div>

            {/* Premium toggle switch */}
            <div className="relative pl-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`
                  w-12 h-7 relative rounded-full transition-all duration-300
                  ${checked
                    ? `bg-gradient-to-r ${currentVariant.gradient} shadow-inner`
                    : 'bg-surface-200 dark:bg-surface-700'
                  }
                `}>
                  <motion.div
                    animate={{
                      x: checked ? 22 : 2,
                      scale: checked ? 1 : 0.8
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TimeChip = ({ minutes, label, icon: Icon, selected, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(minutes)}
      className={`
        relative p-4 rounded-2xl transition-all duration-300 group overflow-hidden
        ${selected
          ? 'bg-gradient-to-br from-brand-500 to-blue-600 text-white shadow-xl shadow-brand-500/25'
          : 'bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 border-2 border-surface-200 dark:border-surface-700'
        }
      `}
    >
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
        />
      )}

      <div className="relative flex flex-col items-center gap-2">
        <div className={`p-3 rounded-xl ${selected ? 'bg-white/20' : 'bg-surface-100 dark:bg-surface-700'}`}>
          <Icon size={20} className={selected ? 'text-white' : 'text-surface-400'} />
        </div>
        <div className="text-lg font-black">{minutes}m</div>
        <div className={`text-xs font-medium ${selected ? 'text-white/90' : 'text-surface-500 dark:text-surface-400'}`}>
          {label}
        </div>
      </div>
    </motion.button>
  );

  const containerClasses = inline
    ? "w-full"
    : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl";

  const contentClasses = inline
    ? "space-y-8"
    : "w-full max-w-2xl bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950 rounded-3xl shadow-2xl shadow-black/20";

  // Tab navigation for better organization
  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'timing', label: 'Timing', icon: Clock },
    { id: 'smart', label: 'Smart', icon: Brain },
    { id: 'quiet', label: 'Quiet', icon: Moon }
  ];

  return (
    <AnimatePresence>
      {isOpen && !inline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={containerClasses}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className={contentClasses}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Header */}
            <div className="relative p-8 pb-4 border-b border-surface-200 dark:border-surface-800 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/5 to-blue-500/5 rounded-full -translate-y-32 translate-x-32" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 shadow-lg shadow-brand-500/30">
                      <Bell size={24} className="text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 border-2 border-dashed border-brand-500/30 rounded-3xl"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-blue-600 bg-clip-text text-transparent">
                      Notification Settings
                    </h2>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                      Customize your alert preferences and smart features
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
                >
                  <X size={20} className="text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300" />
                </motion.button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mt-8">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                      ${activeTab === tab.id
                        ? 'text-white'
                        : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                      }
                    `}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-brand-500 to-blue-600 rounded-xl -z-10"
                      />
                    )}
                    <tab.icon size={16} />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-8">
              {/* General Settings */}
              <AnimatePresence mode="wait">
                {activeTab === 'general' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <EnhancedToggle
                      checked={settings.enabled}
                      onChange={(v) => updateSettings({ enabled: v })}
                      icon={settings.enabled ? Bell : BellOff}
                      label="Master Switch"
                      description="Enable or disable all notifications at once"
                      variant="default"
                    />

                    <EnhancedToggle
                      checked={settings.soundEnabled}
                      onChange={(v) => updateSettings({ soundEnabled: v })}
                      icon={settings.soundEnabled ? Volume2 : VolumeX}
                      label="Sound Alerts"
                      description="Play sounds for incoming notifications"
                      variant="warning"
                    />

                    <EnhancedToggle
                      checked={settings.pushEnabled}
                      onChange={(v) => updateSettings({ pushEnabled: v })}
                      icon={settings.pushEnabled ? Smartphone : PhoneOff}
                      label="Push Notifications"
                      description="Receive browser push notifications"
                      variant="success"
                    />

                    <EnhancedToggle
                      checked={settings.breakReminders}
                      onChange={(v) => updateSettings({ breakReminders: v })}
                      icon={Headphones}
                      label="Break Reminders"
                      description="Remind you to take regular breaks"
                      variant="critical"
                    />
                  </motion.div>
                )}

                {/* Timing Settings */}
                {activeTab === 'timing' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-3">
                        <Clock className="text-brand-500" />
                        Advanced Warning Timing
                      </h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
                        Choose how early you want to be notified before a task starts
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        <TimeChip
                          minutes={5}
                          label="Quick"
                          icon={Zap}
                          selected={settings.reminderTiming === 5}
                          onClick={(m) => updateSettings({ reminderTiming: m })}
                        />
                        <TimeChip
                          minutes={15}
                          label="Standard"
                          icon={Clock}
                          selected={settings.reminderTiming === 15}
                          onClick={(m) => updateSettings({ reminderTiming: m })}
                        />
                        <TimeChip
                          minutes={30}
                          label="Planned"
                          icon={Calendar}
                          selected={settings.reminderTiming === 30}
                          onClick={(m) => updateSettings({ reminderTiming: m })}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Smart Features */}
                {activeTab === 'smart' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Daily Briefing */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/20 group overflow-hidden"
                      >
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                              <Sun size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-surface-900 dark:text-white">
                                Morning Briefing
                              </h4>
                              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                AI-Powered Insights
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6 leading-relaxed">
                            Receive a personalized summary of your day's priorities, deadlines, and suggested focus areas every morning.
                          </p>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${settings.dailySummary ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-500'}`}>
                              {settings.dailySummary ? 'Active at 8:00 AM' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => updateSettings({ dailySummary: !settings.dailySummary })}
                              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${settings.dailySummary
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                                }`}
                            >
                              {settings.dailySummary ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Overdue Pulse */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-2 border-rose-500/20 group overflow-hidden"
                      >
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg">
                              <AlertCircle size={20} className="text-white" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-surface-900 dark:text-white">
                                Urgent Pulse
                              </h4>
                              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                                Priority Awareness
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6 leading-relaxed">
                            Get gentle reminders about overdue tasks even during focus sessions, without breaking your flow.
                          </p>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${settings.showInProgressOverdue ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-500'}`}>
                              {settings.showInProgressOverdue ? 'Smart Notifications' : 'Standard Mode'}
                            </span>
                            <button
                              onClick={() => updateSettings({ showInProgressOverdue: !settings.showInProgressOverdue })}
                              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${settings.showInProgressOverdue
                                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30'
                                : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                                }`}
                            >
                              {settings.showInProgressOverdue ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Quiet Hours */}
                {activeTab === 'quiet' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                            <Moon size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                              Quiet Hours
                            </h3>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400">
                              Silence notifications during specific hours
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer scale-90">
                          <input
                            type="checkbox"
                            checked={settings.quietHours?.enabled}
                            onChange={(e) => updateSettings({
                              quietHours: { ...settings.quietHours, enabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-16 h-8 bg-surface-200 dark:bg-surface-700 rounded-full peer peer-checked:bg-gradient-to-r from-indigo-500 to-purple-500 after:content-[''] after:absolute after:top-1 after:start-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-8"></div>
                        </label>
                      </div>

                      <AnimatePresence>
                        {settings.quietHours?.enabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 overflow-hidden"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                  Start Time
                                </label>
                                <div className="relative">
                                  <input
                                    type="time"
                                    value={settings.quietHours.start}
                                    onChange={(e) => updateSettings({
                                      quietHours: { ...settings.quietHours, start: e.target.value }
                                    })}
                                    className="w-full p-3 rounded-xl bg-surface-100 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Moon size={16} className="text-indigo-500" />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                  End Time
                                </label>
                                <div className="relative">
                                  <input
                                    type="time"
                                    value={settings.quietHours.end}
                                    onChange={(e) => updateSettings({
                                      quietHours: { ...settings.quietHours, end: e.target.value }
                                    })}
                                    className="w-full p-3 rounded-xl bg-surface-100 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Sun size={16} className="text-amber-500" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                              <div className="flex items-center gap-3">
                                <Shield size={16} className="text-indigo-500" />
                                <span className="text-sm text-indigo-700 dark:text-indigo-300">
                                  Critical notifications will still come through
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-8 pt-6 border-t border-surface-200 dark:border-surface-800 bg-gradient-to-t from-white dark:from-surface-900 to-transparent">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-blue-600 text-white font-medium shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all flex items-center gap-2"
                >
                  <Check size={18} />
                  Apply Settings
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {inline && (
        <div className={contentClasses}>
          {/* Simplified inline version */}
          <div className="space-y-6">
            <EnhancedToggle
              checked={settings.enabled}
              onChange={(v) => updateSettings({ enabled: v })}
              icon={settings.enabled ? Bell : BellOff}
              label="Notifications"
              description="Enable all system notifications"
            />

            <EnhancedToggle
              checked={settings.soundEnabled}
              onChange={(v) => updateSettings({ soundEnabled: v })}
              icon={settings.soundEnabled ? Volume2 : VolumeX}
              label="Sound"
              description="Play notification sounds"
              variant="warning"
            />

            <EnhancedToggle
              checked={settings.pushEnabled}
              onChange={(v) => updateSettings({ pushEnabled: v })}
              icon={settings.pushEnabled ? Smartphone : PhoneOff}
              label="Push"
              description="Browser push notifications"
              variant="success"
            />

            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <h4 className="text-sm font-bold text-surface-900 dark:text-white mb-3">Reminder Timing</h4>
              <div className="grid grid-cols-3 gap-2">
                <TimeChip
                  minutes={5}
                  label="5m"
                  icon={Zap}
                  selected={settings.reminderTiming === 5}
                  onClick={(m) => updateSettings({ reminderTiming: m })}
                />
                <TimeChip
                  minutes={15}
                  label="15m"
                  icon={Clock}
                  selected={settings.reminderTiming === 15}
                  onClick={(m) => updateSettings({ reminderTiming: m })}
                />
                <TimeChip
                  minutes={30}
                  label="30m"
                  icon={Calendar}
                  selected={settings.reminderTiming === 30}
                  onClick={(m) => updateSettings({ reminderTiming: m })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationSettings;