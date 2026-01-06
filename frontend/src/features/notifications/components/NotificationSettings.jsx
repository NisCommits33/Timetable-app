import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Volume2, Moon, Sun, Clock, Repeat, AlertCircle, ChevronRight, X, Headphones, Smartphone } from 'lucide-react';
import { useNotifications } from '../../../providers/NotificationProvider';
import { REMINDER_TIMINGS } from '../../../utils/notificationTypes';

const NotificationSettings = ({ isDarkMode, isOpen, onClose, inline = false }) => {
  const { settings, setSettings } = useNotifications();

  if (!isOpen && !inline) return null;

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const Toggle = ({ checked, onChange, icon: Icon, label, desc }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-surface-800/40 border border-black/5 dark:border-white/5 hover:border-brand-500/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-colors ${checked ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-surface-700 text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-200'}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-sm font-bold text-surface-900 dark:text-white">{label}</div>
          <div className="text-[10px] font-medium text-surface-500 dark:text-surface-400 leading-tight">{desc}</div>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-surface-200 dark:bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
      </label>
    </div>
  );

  const containerClasses = inline
    ? "w-full"
    : "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4";

  const contentClasses = inline
    ? "space-y-6"
    : "w-full max-w-xl glass-card overflow-hidden shadow-2xl animate-scale-in";

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {/* Header (Only for Modal) */}
        {!inline && (
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-gradient-to-br from-brand-500/[0.05] to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-500 text-white">
                <Settings size={20} />
              </div>
              <h2 className="text-xl font-display font-black text-surface-900 dark:text-white">Preferences</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <X size={20} />
            </button>
          </div>
        )}

        <div className={`space-y-8 ${!inline ? 'p-8 max-h-[80vh] overflow-y-auto custom-scrollbar' : ''}`}>
          {/* Main Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              checked={settings.enabled}
              onChange={(v) => updateSettings({ enabled: v })}
              icon={Bell}
              label="Master Alerts"
              desc="System-wide notifications"
            />
            <Toggle
              checked={settings.soundEnabled}
              onChange={(v) => updateSettings({ soundEnabled: v })}
              icon={Volume2}
              label="Audio Cues"
              desc="Hear the notifications"
            />
            <Toggle
              checked={settings.pushEnabled}
              onChange={(v) => updateSettings({ pushEnabled: v })}
              icon={Smartphone}
              label="Push Sync"
              desc="Browser-level alerts"
            />
            <Toggle
              checked={settings.breakReminders}
              onChange={(v) => updateSettings({ breakReminders: v })}
              icon={Headphones}
              label="Break Mind"
              desc="Work-rest balance"
            />
          </div>

          <div className="h-px bg-black/[0.03] dark:bg-white/[0.03]" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reminder Timing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-brand-500" />
                <span className="text-xs font-black uppercase tracking-widest text-surface-400">Advance Warning</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(REMINDER_TIMINGS).map(([key, minutes]) => (
                  <button
                    key={key}
                    onClick={() => updateSettings({ reminderTiming: minutes })}
                    className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.reminderTiming === minutes
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'bg-surface-50 dark:bg-surface-800 text-surface-400 border border-black/5 dark:border-white/5 hover:border-brand-500/30'
                      }`}
                  >
                    {minutes} M
                  </button>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon size={16} className="text-indigo-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-surface-400">Quiet Chamber</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-75">
                  <input
                    type="checkbox"
                    checked={settings.quietHours?.enabled}
                    onChange={(e) => updateSettings({
                      quietHours: { ...settings.quietHours, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-200 dark:bg-surface-700 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <AnimatePresence>
                {settings.quietHours?.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-2 overflow-hidden"
                  >
                    <div className="p-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-black/5 dark:border-white/5 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block ml-1 text-center">Inhale</span>
                      <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => updateSettings({ quietHours: { ...settings.quietHours, start: e.target.value } })}
                        className="w-full bg-transparent text-sm font-bold text-center dark:text-white outline-none"
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-black/5 dark:border-white/5 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block ml-1 text-center">Exhale</span>
                      <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => updateSettings({ quietHours: { ...settings.quietHours, end: e.target.value } })}
                        className="w-full bg-transparent text-sm font-bold text-center dark:text-white outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-px bg-black/[0.03] dark:bg-white/[0.03]" />

          {/* Smart Summaries & Logic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-brand-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Sun size={20} className="text-amber-500" />
                <span className="text-sm font-display font-black text-surface-900 dark:text-white">Daily Intelligence</span>
              </div>
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400 leading-relaxed mb-4">
                Receive a morning briefing of your critical paths and strategic objectives.
              </p>
              <button
                onClick={() => updateSettings({ dailySummary: !settings.dailySummary })}
                className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.dailySummary
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-white dark:bg-surface-800 text-surface-400 border border-black/5 dark:border-white/5'
                  }`}
              >
                {settings.dailySummary ? 'Briefing Active' : 'Enable Briefing'}
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-rose-500" />
                <span className="text-sm font-display font-black text-surface-900 dark:text-white">Overdue Pulse</span>
              </div>
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400 leading-relaxed mb-4">
                Maintain awareness of overdue tasks even during deep work sessions.
              </p>
              <button
                onClick={() => updateSettings({ showInProgressOverdue: !settings.showInProgressOverdue })}
                className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.showInProgressOverdue
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-white dark:bg-surface-800 text-surface-400 border border-black/5 dark:border-white/5'
                  }`}
              >
                {settings.showInProgressOverdue ? 'Pulse Enabled' : 'Enable Pulse'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer (Only for Modal) */}
        {!inline && (
          <div className="p-8 border-t border-black/5 dark:border-white/5 flex justify-end">
            <button
              onClick={onClose}
              className="premium-button py-3 px-8 shadow-premium"
            >
              Apply Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;