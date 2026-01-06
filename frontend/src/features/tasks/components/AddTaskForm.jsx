import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  MapPin,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Settings,
  Calendar,
  AlertCircle,
  Hash,
  Sparkles,
  Layout,
  MessageSquare
} from "lucide-react";

/**
 * Enhanced AddTaskForm - A masterpiece of UI/UX for creating tasks
 */

// Moved outside to prevent re-creation on every render (focus loss fix)
const InputField = ({ label, icon: Icon, children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
      <Icon size={12} className="text-brand-500" />
      {label}
    </label>
    {children}
  </div>
);

function AddTaskForm({ onAddTask, isDarkMode }) {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [day, setDay] = useState("Monday");
  const [priority, setPriority] = useState("medium");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("personal");

  // UI state
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [isPriorityExpanded, setIsPriorityExpanded] = useState(false);
  const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = useState(false);
  const [suggestedTags] = useState(["work", "personal", "health", "urgent", "meeting", "study"]);

  // Refs for outside click handling
  const timeDropdownRef = useRef(null);
  const priorityDropdownRef = useRef(null);
  const tagSuggestionsRef = useRef(null);

  const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

  const priorityOptions = [
    { value: "low", label: "Low Priority", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
    { value: "medium", label: "Medium Priority", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
    { value: "high", label: "High Priority", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", dot: "bg-rose-500" },
  ];

  const categories = [
    { id: 'personal', label: 'Personal', icon: Tag },
    { id: 'work', label: 'Work', icon: Layout },
    { id: 'health', label: 'Health', icon: HeartIcon },
    { id: 'finance', label: 'Finance', icon: WalletIcon }
  ];

  // Placeholder for missing icons
  function HeartIcon(props) { return <div className="w-4 h-4 rounded-full border-2 border-current opacity-50" /> }
  function WalletIcon(props) { return <div className="w-4 h-4 rounded border-2 border-current opacity-50" /> }

  const calculateEstimatedDuration = (start, end) => {
    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);
    const durationMinutes = (eH * 60 + eM) - (sH * 60 + sM);
    return Math.max(durationMinutes * 60, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description,
      startTime,
      endTime,
      date: new Date().toISOString().split("T")[0],
      day,
      priority,
      location,
      notes,
      tags,
      category,
      completed: false,
      timeTracking: { isTracking: false, totalTimeSpent: 0, currentSessionStart: null, sessions: [] },
      estimatedDuration: calculateEstimatedDuration(startTime, endTime),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setNotes("");
    setTags([]);
    setTagInput("");
  };

  const addTag = (tag = tagInput.trim()) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
    setIsTagSuggestionsOpen(false);
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) setIsTimeExpanded(false);
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target)) setIsPriorityExpanded(false);
      if (tagSuggestionsRef.current && !tagSuggestionsRef.current.contains(event.target)) setIsTagSuggestionsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPriority = priorityOptions.find(o => o.value === priority) || priorityOptions[1];

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
      {/* Primary Info */}
      <div className="space-y-6">
        <InputField label="Objective Title" icon={Sparkles}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-800 border-2 border-transparent focus:border-brand-500/30 dark:focus:border-brand-500/30 text-lg font-display font-bold text-surface-900 dark:text-white placeholder-surface-300 dark:placeholder-surface-600 shadow-sm transition-all outline-none"
            placeholder="What's the main mission?"
            required
          />
        </InputField>

        <InputField label="Detailed Intelligence" icon={MessageSquare}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-800 border-2 border-transparent focus:border-brand-500/30 dark:focus:border-brand-500/30 text-sm font-medium text-surface-700 dark:text-surface-300 placeholder-surface-300 dark:placeholder-surface-600 shadow-sm transition-all outline-none resize-none"
            placeholder="Add context, goals, or notes..."
          />
        </InputField>
      </div>

      <div className="h-px bg-black/[0.03] dark:bg-white/[0.05]" />

      {/* Scheduling Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputField label="Temporal Window" icon={Clock}>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
                <div className="absolute top-0 right-0 p-1 opacity-20 pointer-events-none">
                  <ChevronDown size={10} />
                </div>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>
          </InputField>

          <InputField label="Designated Day" icon={Calendar}>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
            >
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </InputField>
        </div>

        <div className="space-y-6">
          <InputField label="Priority Tier" icon={AlertCircle}>
            <div className="flex gap-2" ref={priorityDropdownRef}>
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${priority === opt.value
                    ? `${opt.bg} ${opt.color} ${opt.border} shadow-lg`
                    : 'bg-surface-50 dark:bg-surface-800 text-surface-400 border-transparent hover:border-black/5 dark:hover:border-white/10'
                    }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${priority === opt.value ? opt.dot : 'bg-surface-300 dark:bg-surface-600'}`} />
                    {opt.value}
                  </div>
                </button>
              ))}
            </div>
          </InputField>

          <InputField label="Deployment Zone" icon={MapPin}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-black/5 dark:border-white/5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder-surface-400"
              placeholder="Where will this occur?"
            />
          </InputField>
        </div>
      </div>

      <div className="h-px bg-black/[0.03] dark:bg-white/[0.05]" />

      {/* Metadata & Categories */}
      <div className="space-y-6">
        <InputField label="Operational Category" icon={Layout}>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${category === cat.id
                  ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20'
                  : 'bg-surface-50 dark:bg-surface-800 text-surface-400 border-black/5 dark:border-white/5 hover:border-brand-500/30'
                  }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </InputField>

        <InputField label="Classification Tags" icon={Hash}>
          <div className="p-2 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-black/5 dark:border-white/5 flex flex-wrap gap-2">
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest border border-brand-500/20"
                >
                  {tag}
                  <X size={12} className="cursor-pointer hover:text-rose-500" onClick={() => removeTag(tag)} />
                </motion.span>
              ))}
            </AnimatePresence>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => { setTagInput(e.target.value); setIsTagSuggestionsOpen(e.target.value.length > 0); }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 bg-transparent min-w-[120px] px-2 py-1 text-xs font-bold dark:text-white outline-none placeholder-surface-400"
              placeholder="Search or create tags..."
            />
          </div>

          <AnimatePresence>
            {isTagSuggestionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-2 p-2 mt-2 bg-white dark:bg-surface-700 rounded-xl shadow-xl border border-black/5 dark:border-white/5"
              >
                {suggestedTags.filter(t => !tags.includes(t) && t.includes(tagInput)).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTag(t)}
                    className="px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300 text-[10px] font-bold hover:bg-brand-500 hover:text-white transition-all transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </InputField>
      </div>

      {/* Form Submission */}
      <div className="pt-6 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="premium-button flex items-center gap-3 px-10 py-5 shadow-2xl shadow-brand-500/30"
        >
          <Plus size={20} className="stroke-[3]" />
          <span className="font-display font-black uppercase tracking-widest">Deploy Objective</span>
        </motion.button>
      </div>
    </form>
  );
}

export default AddTaskForm;
