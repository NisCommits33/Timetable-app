import React from 'react';
import { Settings, Bell, Volume2, Moon, Sun, Clock, Repeat, AlertCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { REMINDER_TIMINGS } from '../utils/notificationTypes';

const NotificationSettings = ({ isDarkMode, isOpen, onClose }) => {
  const { settings, setSettings } = useNotifications();
  

  if (!isOpen) return null;

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-xl ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Enable Notifications</div>
                <div className="text-sm text-gray-500">Show notifications for upcoming tasks</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => updateSettings({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              } peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500`}>
                <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
                  settings.enabled ? 'translate-x-5' : ''
                }`} />
              </div>
            </label>
          </div>

          {/* Reminder Timing */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div className="font-medium">Reminder Timing</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(REMINDER_TIMINGS).map(([key, minutes]) => (
                <button
                  key={key}
                  onClick={() => updateSettings({ reminderTiming: minutes })}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.reminderTiming === minutes
                      ? 'bg-blue-600 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Notification Sound</div>
                <div className="text-sm text-gray-500">Play sound with notifications</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              } peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500`}>
                <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : ''
                }`} />
              </div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">Show browser push notifications</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={(e) => updateSettings({ pushEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              } peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500`}>
                <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
                  settings.pushEnabled ? 'translate-x-5' : ''
                }`} />
              </div>
            </label>
          </div>

          {/* Break Reminders */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Break Reminders</div>
                <div className="text-sm text-gray-500">Remind to take breaks during work</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.breakReminders}
                onChange={(e) => updateSettings({ breakReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              } peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500`}>
                <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
                  settings.breakReminders ? 'translate-x-5' : ''
                }`} />
              </div>
            </label>
          </div>

          {/* Daily Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Daily Summary</div>
                <div className="text-sm text-gray-500">Morning schedule overview</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dailySummary}
                onChange={(e) => updateSettings({ dailySummary: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              } peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500`}>
                <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
                  settings.dailySummary ? 'translate-x-5' : ''
                }`} />
              </div>
            </label>
          </div>

          {/* Quiet Hours */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Quiet Hours</div>
                <div className="text-sm text-gray-500">Pause notifications during night</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.quietHours.enabled}
                onChange={(e) => updateSettings({ 
                  quietHours: { ...settings.quietHours, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              } peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500`}>
                <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
                  settings.quietHours.enabled ? 'translate-x-5' : ''
                }`} />
              </div>
            </label>
          </div>

          {/* Quiet Hours Time Selection */}
          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
              <div>
                <label className="block text-sm font-medium mb-1">Start</label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => updateSettings({
                    quietHours: { ...settings.quietHours, start: e.target.value }
                  })}
                  className={`w-full px-2 py-1 rounded border text-sm ${
                    isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End</label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => updateSettings({
                    quietHours: { ...settings.quietHours, end: e.target.value }
                  })}
                  className={`w-full px-2 py-1 rounded border text-sm ${
                    isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          )}
          {/* Reminder Frequency */}
<div>
  <div className="flex items-center space-x-3 mb-3">
    <Repeat className="h-4 w-4 text-gray-500" />
    <div>
      <div className="font-medium">Reminder Frequency</div>
      <div className="text-sm text-gray-500">How often to remind before task starts</div>
    </div>
  </div>
  <div className="grid grid-cols-2 gap-2">
    {[
      { value: 'once', label: 'Once' },
      { value: '5min', label: 'Every 5 min' },
      { value: '10min', label: 'Every 10 min' },
      { value: 'until_start', label: 'Until start' }
    ].map(option => (
      <button
        key={option.value}
        onClick={() => updateSettings({ reminderFrequency: option.value })}
        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
          settings.reminderFrequency === option.value
            ? 'bg-blue-600 text-white'
            : isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
</div>

{/* Overdue Frequency */}
<div>
  <div className="flex items-center space-x-3 mb-3">
    <AlertCircle className="h-4 w-4 text-gray-500" />
    <div>
      <div className="font-medium">Overdue Frequency</div>
      <div className="text-sm text-gray-500">How often to remind after missed start</div>
    </div>
  </div>
  <div className="grid grid-cols-2 gap-2">
    {[
      { value: 'once', label: 'Once' },
      { value: '5min', label: 'Every 5 min' },
      { value: '10min', label: 'Every 10 min' },
      { value: 'until_done', label: 'Until done' }
    ].map(option => (
      <button
        key={option.value}
        onClick={() => updateSettings({ overdueFrequency: option.value })}
        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
          settings.overdueFrequency === option.value
            ? 'bg-blue-600 text-white'
            : isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
</div>

{/* Show Overdue During Work */}
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-3">
    <Clock className="h-4 w-4 text-gray-500" />
    <div>
      <div className="font-medium">Overdue During Work</div>
      <div className="text-sm text-gray-500">Show overdue notifications while timer is running</div>
    </div>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={settings.showInProgressOverdue}
      onChange={(e) => updateSettings({ showInProgressOverdue: e.target.checked })}
      className="sr-only peer"
    />
    <div className={`w-11 h-6 rounded-full peer ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
    } peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500`}>
      <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${
        settings.showInProgressOverdue ? 'translate-x-5' : ''
      }`} />
    </div>
  </label>
</div>

{/* Max Reminders Per Task */}
<div>
  <div className="flex items-center space-x-3 mb-3">
    <Bell className="h-4 w-4 text-gray-500" />
    <div>
      <div className="font-medium">Max Reminders Per Task</div>
      <div className="text-sm text-gray-500">Maximum number of reminders before stopping</div>
    </div>
  </div>
  <div className="grid grid-cols-4 gap-2">
    {[1, 2, 3, 5].map(count => (
      <button
        key={count}
        onClick={() => updateSettings({ maxRemindersPerTask: count })}
        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
          settings.maxRemindersPerTask === count
            ? 'bg-blue-600 text-white'
            : isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {count}
      </button>
    ))}
  </div>
</div>
          
        </div>

        {/* Footer */}
        <div className={`flex justify-end p-6 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
        
      </div>
      
    </div>
  );
};

export default NotificationSettings;