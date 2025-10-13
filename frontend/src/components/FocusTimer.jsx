// components/FocusTimer.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Clock, 
  Coffee, 
  Target,
  BarChart3,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

const FocusTimer = ({ isDarkMode, onTimerComplete, currentTask }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [autoStartBreak, setAutoStartBreak] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Timer presets
  const timerPresets = {
    focus: 25 * 60, // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60 // 15 minutes
  };

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification-sound.mp3'); // You can add a sound file
    // Fallback: Use a simple beep sound using the Web Audio API
    if (!audioRef.current.src) {
      // We'll create sound using Web Audio API in handleTimerEnd
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handleTimerEnd = () => {
    setIsActive(false);
    clearInterval(intervalRef.current);
    
    // Play completion sound
    if (soundEnabled) {
      playCompletionSound();
    }
    
    // Show notification
    if (onTimerComplete) {
      onTimerComplete(mode, sessionsCompleted);
    }
    
    // Auto-start break if enabled
    if (mode === 'focus' && autoStartBreak) {
      const nextBreak = sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak';
      setMode(nextBreak);
      setTimeLeft(timerPresets[nextBreak]);
      if (autoStartBreak) {
        setTimeout(() => setIsActive(true), 2000); // Short delay before auto-start
      }
    }
  };

  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (mode === 'focus') {
        // Break start sound - more relaxing
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      } else {
        // Focus start sound - more energetic
        oscillator.frequency.setValueAtTime(784.00, audioContext.currentTime); // G5
        oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.1); // C6
      }
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio context not supported');
    }
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerPresets[mode]);
  };

  const skipSession = () => {
    setIsActive(false);
    if (mode === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      setMode('shortBreak');
      setTimeLeft(timerPresets.shortBreak);
    } else {
      setMode('focus');
      setTimeLeft(timerPresets.focus);
    }
  };

  const setTimerMode = (newMode, duration) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(duration);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((timerPresets[mode] - timeLeft) / timerPresets[mode]) * 100;

  return (
    <div className={`rounded-xl border p-6 ${
      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold">Focus Timer</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Pomodoro Technique
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
          
          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current Task Display */}
      {currentTask && (
        <div className={`mb-4 p-3 rounded-lg ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Focusing on:</span>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              {currentTask.title}
            </span>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-6">
        {/* Progress Circle */}
        <div className="relative inline-block mb-4">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={isDarkMode ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)"}
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={mode === 'focus' ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold font-mono ${
              mode === 'focus' 
                ? 'text-red-500' 
                : 'text-green-500'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`text-sm font-medium mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {mode === 'focus' ? 'Focus Time' : 
               mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
          </div>
        </div>

        {/* Session Counter */}
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
        }`}>
          <BarChart3 className="h-4 w-4" />
          <span>Session: {sessionsCompleted + (mode === 'focus' ? 1 : 0)}/4</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3 mb-6">
        {!isActive ? (
          <button
            onClick={startTimer}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Play className="h-5 w-5" />
            <span>Start</span>
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Square className="h-5 w-5" />
            <span>Pause</span>
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className={`px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <RotateCcw className="h-5 w-5" />
          <span>Reset</span>
        </button>
        
        <button
          onClick={skipSession}
          className={`px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Coffee className="h-5 w-5" />
          <span>Skip</span>
        </button>
      </div>

      {/* Quick Session Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => setTimerMode('focus', timerPresets.focus)}
          className={`p-3 rounded-lg text-center transition-colors ${
            mode === 'focus'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-2 border-red-500'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Target className="h-4 w-4 mx-auto mb-1" />
          <div className="text-xs font-medium">Focus</div>
          <div className="text-xs opacity-75">25:00</div>
        </button>
        
        <button
          onClick={() => setTimerMode('shortBreak', timerPresets.shortBreak)}
          className={`p-3 rounded-lg text-center transition-colors ${
            mode === 'shortBreak'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-2 border-green-500'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Coffee className="h-4 w-4 mx-auto mb-1" />
          <div className="text-xs font-medium">Short Break</div>
          <div className="text-xs opacity-75">5:00</div>
        </button>
        
        <button
          onClick={() => setTimerMode('longBreak', timerPresets.longBreak)}
          className={`p-3 rounded-lg text-center transition-colors ${
            mode === 'longBreak'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-2 border-blue-500'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Coffee className="h-4 w-4 mx-auto mb-1" />
          <div className="text-xs font-medium">Long Break</div>
          <div className="text-xs opacity-75">15:00</div>
        </button>
      </div>

      {/* Settings Panel */}
      {settingsOpen && (
        <div className={`p-4 rounded-lg border animate-fadeIn ${
          isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
        }`}>
          <h3 className="font-semibold mb-3">Timer Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={autoStartBreak}
                onChange={(e) => setAutoStartBreak(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Auto-start breaks</span>
            </label>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Focus Duration</span>
              <select
                value={timerPresets.focus / 60}
                onChange={(e) => {
                  const newFocus = parseInt(e.target.value) * 60;
                  if (mode === 'focus') setTimeLeft(newFocus);
                }}
                className={`px-2 py-1 rounded border text-sm ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value={15}>15 minutes</option>
                <option value={25}>25 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={50}>50 minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className={`text-xs p-3 rounded-lg ${
        isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-600'
      }`}>
        <strong>Tip:</strong> {mode === 'focus' 
          ? 'Focus on one task until the timer ends.' 
          : 'Step away from your desk and relax.'}
      </div>
    </div>
  );
};

export default FocusTimer;