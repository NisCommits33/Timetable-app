/**
 * EditTaskModal Component
 * Modal for editing existing tasks with full form fields
 */

import { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';

const EditTaskModal = ({ isOpen, task, onClose, onSave, isDarkMode }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        day: '',
        category: 'personal',
        priority: 'medium',
        location: '',
        notes: '',
        tags: [],
    });

    // Update form data when task changes
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                startTime: task.startTime || '',
                endTime: task.endTime || '',
                day: task.day || '',
                category: task.category || 'personal',
                priority: task.priority || 'medium',
                location: task.location || '',
                notes: task.notes || '',
                tags: task.tags || [],
            });
        }
    }, [task]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.startTime || !formData.endTime || !formData.day) {
            return;
        }

        onSave({
            ...task,
            ...formData,
        });
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl ${isDarkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center">
                        <Edit className="h-5 w-5 mr-2 text-blue-600" />
                        Edit Task
                    </h3>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                                ? 'hover:bg-gray-700 text-gray-300'
                                : 'hover:bg-gray-100 text-gray-500'
                            }`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        >
                            Task Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                    ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                }`}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        >
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                    ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                }`}
                        />
                    </div>

                    {/* Time and Day */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                            >
                                Start Time *
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleChange('startTime', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                    }`}
                                required
                            />
                        </div>

                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                            >
                                End Time *
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleChange('endTime', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                    }`}
                                required
                            />
                        </div>
                    </div>

                    {/* Day */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        >
                            Day *
                        </label>
                        <select
                            value={formData.day}
                            onChange={(e) => handleChange('day', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                    ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                }`}
                            required
                        >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                    </div>

                    {/* Category and Priority */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                            >
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                    }`}
                            >
                                <option value="personal">Personal</option>
                                <option value="work">Work</option>
                                <option value="fitness">Fitness</option>
                                <option value="learning">Learning</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                            >
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => handleChange('priority', e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                    }`}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        >
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                    ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                }`}
                            placeholder="Where will this task take place?"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        >
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            rows={4}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                    ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                }`}
                            placeholder="Any additional notes or details..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
