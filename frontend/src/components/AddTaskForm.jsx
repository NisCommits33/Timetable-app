// components/AddTaskForm.jsx
import { useState } from 'react';
import { Plus, Clock, MapPin, AlertCircle, FileText, Tag } from 'lucide-react';

/**
 * AddTaskForm Component - Form for creating new tasks with detailed information
 * @param {Object} props - Component properties
 * @param {Function} props.onAddTask - Callback to add a new task
 * @param {boolean} props.isDarkMode - Current theme mode for styling
 */
function AddTaskForm({ onAddTask, isDarkMode }) {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [day, setDay] = useState('Monday');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new task object with all details
    const newTask = {
      id: Date.now(),
      title,
      description,
      startTime,
      endTime,
      date: new Date().toISOString().split('T')[0],
      day,
      priority,
      location,
      notes,
      tags,
      category: "personal",
      completed: false,
      completedAt: null,
      timeSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddTask(newTask);
    
    // Reset form to initial state
    resetForm();
  };

  /**
   * Resets all form fields to their default values
   */
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('10:00');
    setDay('Monday');
    setPriority('medium');
    setLocation('');
    setNotes('');
    setTags([]);
    setCurrentTag('');
  };

  /**
   * Handles adding tags when Enter is pressed
   * @param {Event} e - Keyboard event
   */
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault(); // Prevent form submission
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  /**
   * Removes a tag from the tags array
   * @param {number} index - Index of the tag to remove
   */
  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Task Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDarkMode
              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          }`}
          placeholder="What needs to be done?"
          required
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDarkMode
              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          }`}
          placeholder="Describe the task..."
        />
      </div>

      {/* Time Inputs Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Start Time */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Start Time *
          </label>
          <div className="relative">
            <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
              required
            />
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            End Time *
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
            required
          />
        </div>
      </div>

      {/* Day and Priority Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Day Selection */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Day of Week *
          </label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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

        {/* Priority Selection */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Priority
          </label>
          <div className="relative">
            <AlertCircle className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location Input */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Location
        </label>
        <div className="relative">
          <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
            placeholder="Where will this happen?"
          />
        </div>
      </div>

      {/* Tags Input */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Tags
        </label>
        <div className="relative">
          <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={handleAddTag}
            className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
            placeholder="Add tags (Press Enter)"
          />
        </div>
        
        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDarkMode
                    ? 'bg-blue-900/30 text-blue-300'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-1.5 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes Textarea */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Notes
        </label>
        <div className="relative">
          <FileText className={`absolute left-3 top-3 h-4 w-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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

export default AddTaskForm;