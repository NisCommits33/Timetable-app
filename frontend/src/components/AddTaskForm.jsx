// components/AddTaskForm.jsx
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
  Check,
} from "lucide-react";

/**
 * Enhanced AddTaskForm with improved time picker, priority selector, and tag system
 * @param {Object} props - Component properties
 * @param {Function} props.onAddTask - Callback to add a new task
 * @param {boolean} props.isDarkMode - Current theme mode for styling
 */
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

  // UI state
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [isPriorityExpanded, setIsPriorityExpanded] = useState(false);
  const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([
    "work",
    "personal",
    "health",
    "urgent",
    "meeting",
    "study",
  ]);

  // Refs
  const tagInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Predefined time slots for quick selection
  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  // Priority options with icons and colors
  const priorityOptions = [
    {
      value: "low",
      label: "Low Priority",
      color: "text-green-600",
      bgColor: "bg-green-100",
      darkBgColor: "bg-green-900/30",
      icon: "🟢",
    },
    {
      value: "medium",
      label: "Medium Priority",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      darkBgColor: "bg-yellow-900/30",
      icon: "🟡",
    },
    {
      value: "high",
      label: "High Priority",
      color: "text-red-600",
      bgColor: "bg-red-100",
      darkBgColor: "bg-red-900/30",
      icon: "🔴",
    },
  ];
  //Add this function to calculate duration automatically
  const calculateEstimatedDuration = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    const durationMinutes = endTotal - startTotal;

    return Math.max(durationMinutes * 60, 900); // Convert to seconds, minimum 15 minutes
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title,
      description,
      startTime,
      endTime,
      date: new Date().toISOString().split("T")[0],
      day,
      priority,
      location,
      notes,
      tags,
      category: "personal",
      completed: false,
      completedAt: null,
      timeTracking: {
        isTracking: false,
        totalTimeSpent: 0,
        currentSessionStart: null,
        sessions: [],
      },
      // FIX: Calculate estimated duration from task times
      estimatedDuration: calculateEstimatedDuration(startTime, endTime),
      actualDuration: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddTask(newTask);
    resetForm();
  };

  /**
   * Resets form to initial state
   */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("09:00");
    setEndTime("10:00");
    setDay("Monday");
    setPriority("medium");
    setLocation("");
    setNotes("");
    setTags([]);
    setTagInput("");
  };

  /**
   * Handles tag input with create-as-you-type functionality
   */
  const handleTagInput = (e) => {
    setTagInput(e.target.value);
    setIsTagSuggestionsOpen(e.target.value.length > 0);
  };

  /**
   * Adds a tag from input or suggestions
   */
  const addTag = (tag = tagInput.trim()) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);

      // Add to suggestions if it's new
      if (!suggestedTags.includes(tag)) {
        setSuggestedTags([tag, ...suggestedTags]);
      }
    }
    setTagInput("");
    setIsTagSuggestionsOpen(false);
  };

  /**
   * Handles tag removal
   */
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  /**
   * Handles keyboard events for tag input
   */
  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      removeTag(tags[tags.length - 1]);
    }
  };

  /**
   * Sets time with duration calculation
   */
  const setTimeWithDuration = (newStartTime, durationMinutes = 60) => {
    const [hours, minutes] = newStartTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    setStartTime(newStartTime);
    setEndTime(
      `${endHours.toString().padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  /**
   * Gets current priority option
   */
  const getCurrentPriority = () => {
    return (
      priorityOptions.find((opt) => opt.value === priority) ||
      priorityOptions[1]
    );
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setIsTagSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPriority = getCurrentPriority();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Task Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          }`}
          placeholder="What needs to be done?"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          }`}
          placeholder="Describe the task..."
        />
      </div>

      {/* Enhanced Time Selection */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Time *
        </label>

        {/* Quick Time Selection */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setIsTimeExpanded(!isTimeExpanded)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          >
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {startTime} - {endTime} ({calculateDuration(startTime, endTime)})
            </span>
            {isTimeExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Expanded Time Picker */}
          {isTimeExpanded && (
            <div className="mt-2 p-3 rounded-lg border animate-fadeIn">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full px-2 py-1 text-sm rounded border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-800 text-white"
                        : "border-gray-300 bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full px-2 py-1 text-sm rounded border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-800 text-white"
                        : "border-gray-300 bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              {/* Quick Time Slots */}
              <div>
                <label
                  className={`block text-xs font-medium mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Quick Select (1-hour slots):
                </label>
                <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeWithDuration(slot)}
                      className={`p-1 text-xs rounded transition-colors ${
                        startTime === slot
                          ? "bg-blue-600 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Day Selection */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Day of Week *
        </label>
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              : "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          }`}
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>

      {/* Enhanced Priority Selection */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Priority
        </label>

        <div className="relative" ref={suggestionsRef}>
          <button
            type="button"
            onClick={() => setIsPriorityExpanded(!isPriorityExpanded)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            } ${currentPriority.color}`}
          >
            <span className="flex items-center">
              <span className="mr-2">{currentPriority.icon}</span>
              {currentPriority.label}
            </span>
            {isPriorityExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Priority Options Dropdown */}
          {isPriorityExpanded && (
            <div
              className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg animate-fadeIn ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-white"
              }`}
            >
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setPriority(option.value);
                    setIsPriorityExpanded(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-left transition-colors ${
                    priority === option.value
                      ? isDarkMode
                        ? "bg-blue-900/30"
                        : "bg-blue-100"
                      : isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-50"
                  } ${option.color}`}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                  {priority === option.value && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Location
        </label>
        <div className="relative">
          <MapPin
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            }`}
            placeholder="Where will this happen?"
          />
        </div>
      </div>

      {/* Enhanced Tag System */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Tags
        </label>

        <div className="relative" ref={suggestionsRef}>
          {/* Tag Input Container */}
          <div
            className={`flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 focus-within:border-blue-500"
                : "border-gray-300 bg-white focus-within:border-blue-500"
            }`}
          >
            {/* Existing Tags */}
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  isDarkMode
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {/* Tag Input */}
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={handleTagInput}
              onKeyDown={handleTagKeyPress}
              onFocus={() => setIsTagSuggestionsOpen(tagInput.length > 0)}
              className={`flex-1 min-w-[100px] bg-transparent outline-none ${
                isDarkMode
                  ? "text-white placeholder-gray-400"
                  : "text-gray-900 placeholder-gray-500"
              }`}
              placeholder={
                tags.length === 0 ? "Add tags..." : "Add another tag..."
              }
            />
          </div>

          {/* Tag Suggestions */}
          {isTagSuggestionsOpen && (
            <div
              className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg animate-fadeIn ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-white"
              }`}
            >
              {/* Create New Tag Option */}
              {tagInput.trim() && !suggestedTags.includes(tagInput.trim()) && (
                <button
                  type="button"
                  onClick={() => addTag()}
                  className={`flex items-center w-full px-3 py-2 text-left transition-colors ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2 text-green-500" />
                  Create new tag: "
                  <span className="font-medium">{tagInput.trim()}</span>"
                </button>
              )}

              {/* Suggested Tags */}
              {suggestedTags
                .filter((tag) =>
                  tag.toLowerCase().includes(tagInput.toLowerCase())
                )
                .map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addTag(tag)}
                    className={`flex items-center w-full px-3 py-2 text-left transition-colors ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    {tag}
                    {tags.includes(tag) && (
                      <Check className="h-4 w-4 ml-auto text-green-500" />
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Notes
        </label>
        <div className="relative">
          <FileText
            className={`absolute left-3 top-3 h-4 w-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            }`}
            placeholder="Additional notes..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add Task</span>
      </button>
    </form>
  );
}

/**
 * Calculates duration between two times
 */
const calculateDuration = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  const duration = endTotal - startTotal;

  if (duration <= 0) return "0m";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default AddTaskForm;
