import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Square, RotateCcw, X, MoreVertical, Volume2, VolumeX, Minimize2, Maximize2
} from 'lucide-react';

const FocusTimer = ({ isDarkMode, onTimerComplete, currentTask, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef(null);

  const presets = {
    focus: { time: 25 * 60, color: 'text-rose-500', bg: 'bg-rose-500', label: 'Pulse' },
    shortBreak: { time: 5 * 60, color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Recharge' },
    longBreak: { time: 15 * 60, color: 'text-blue-500', bg: 'bg-blue-500', label: 'Deep Rest' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(intervalRef.current);
      if (soundEnabled) playSound();
      if (onTimerComplete) onTimerComplete(mode);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, mode, onTimerComplete, soundEnabled]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(presets[mode].time);
  };

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.error(e); }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = ((presets[mode].time - timeLeft) / presets[mode].time) * 100;
  const currentTheme = presets[mode];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      drag
      dragMomentum={false}
      className={`fixed bottom-6 right-6 z-[80] overflow-hidden backdrop-blur-xl border shadow-2xl transition-all duration-300
        ${isExpanded ? 'rounded-[2rem] w-80' : 'rounded-full w-auto'}
        ${isDarkMode ? 'bg-surface-900/80 border-white/10' : 'bg-white/80 border-black/5'}
      `}
    >
      {/* Background Progress Bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${currentTheme.bg} opacity-50`}
        style={{ width: `${progress}%` }}
      />

      <div className="relative p-4">
        {isExpanded ? (
          // Expanded View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${currentTheme.bg} animate-pulse`} />
                <span className="text-xs font-black uppercase tracking-widest text-surface-500">
                  {currentTheme.label} Protocol
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsExpanded(false)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-surface-400">
                  <Minimize2 size={14} />
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-surface-400">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`text-6xl font-display font-bold tabular-nums tracking-tight ${currentTheme.color} drop-shadow-sm`}>
                {formatTime(timeLeft)}
              </div>
              {currentTask && (
                <div className="mt-2 px-3 py-1 rounded-full bg-surface-100 dark:bg-black/20 text-[10px] font-bold text-surface-500 max-w-[200px] truncate">
                  {currentTask.title}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`p-4 rounded-2xl ${currentTheme.bg} text-white shadow-lg shadow-${currentTheme.color}-500/30 hover:scale-105 active:scale-95 transition-all`}
              >
                {isActive ? <Square fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
              </button>
              <button
                onClick={resetTimer}
                className="p-4 rounded-xl bg-surface-100 dark:bg-white/5 text-surface-500 hover:bg-surface-200 dark:hover:bg-white/10 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="flex justify-between px-2 pt-2 border-t border-black/5 dark:border-white/5">
              {['focus', 'shortBreak', 'longBreak'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setIsActive(false); setTimeLeft(presets[m].time); }}
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg transition-colors ${mode === m
                    ? 'text-surface-900 dark:text-white bg-black/5 dark:bg-white/10'
                    : 'text-surface-400 hover:text-surface-600'}`}
                >
                  {m.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Minimized View (Capsule)
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3" onClick={() => setIsExpanded(true)}>
              <div className={`text-xl font-bold font-mono tabular-nums ${currentTheme.color}`}>
                {formatTime(timeLeft)}
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-ping' : ''} ${currentTheme.bg}`} />
            </div>

            <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

            <button onClick={toggleTimer} className="hover:text-brand-500 transition-colors">
              {isActive ? <Square size={14} /> : <Play size={14} />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FocusTimer;