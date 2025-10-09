// In CompletionModal.jsx - Fix height and closing issues
import { useState, useEffect } from 'react'; // ADD useEffect
import { 
  CheckCircle, 
  X, 
  Clock, 
  Star, 
  MessageCircle, 
  Calendar,
  Flag,
  Zap
} from 'lucide-react';

const CompletionModal = ({ 
  isOpen, 
  onClose, 
  task, 
  onComplete, 
  isDarkMode 
}) => {
  const [remarks, setRemarks] = useState('');
  const [completionType, setCompletionType] = useState('completed');
  const [timeSpent, setTimeSpent] = useState('');
  const [rating, setRating] = useState(0);
  const [customRemarks, setCustomRemarks] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const completionTypes = [
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: CheckCircle, 
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'Task finished successfully'
    },
    { 
      id: 'partially', 
      label: 'Partially Done', 
      icon: CheckCircle, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: 'Made progress but not fully complete'
    },
    { 
      id: 'cancelled', 
      label: 'Cancelled', 
      icon: X, 
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      description: 'Task was cancelled'
    },
    { 
      id: 'deferred', 
      label: 'Deferred', 
      icon: Calendar, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Postponed to later'
    }
  ];

  const quickRemarks = [
    'Finished ahead of schedule 🎉',
    'Took longer than expected ⏱️',
    'Easy task ✅',
    'Need to review later 🔍',
    'Blocked by dependencies 🚧',
    'Completed with help 👥'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const completionData = {
      completed: completionType === 'completed' || completionType === 'partially',
      completionType,
      remarks: remarks || customRemarks,
      completedAt: new Date().toISOString(),
      timeSpent: timeSpent ? parseInt(timeSpent) : null,
      satisfaction: rating,
      actualDuration: timeSpent ? parseInt(timeSpent) * 60 : task.actualDuration
    };

    onComplete(task.id, completionData);
    onClose(); // FIX: Close modal after submit
  };

  const resetForm = () => {
    setRemarks('');
    setCompletionType('completed');
    setTimeSpent('');
    setRating(0);
    setCustomRemarks('');
  };

  const handleQuickRemark = (remark) => {
    setRemarks(remark);
    setCustomRemarks('');
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'No time tracked';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* FIX: Added max-h-screen and overflow-y-auto for scrollable modal */}
      <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-xl ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-inherit z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <h2 className="text-lg font-semibold">Complete Task</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add completion details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-4">
          {/* Task Info */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-semibold text-sm mb-2">{task.title}</h3>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{task.startTime} - {task.endTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Flag className="h-3 w-3" />
                <span className={`capitalize ${
                  task.priority === 'high' ? 'text-red-500' :
                  task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
            {task.timeTracking?.totalTimeSpent > 0 && (
              <div className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                <Zap className="h-3 w-3 inline mr-1" />
                Time spent: {formatDuration(task.timeTracking.totalTimeSpent / 1000)}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Completion Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Completion Status</label>
              <div className="grid grid-cols-2 gap-2">
                {completionTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setCompletionType(type.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        completionType === type.id
                          ? type.bgColor + ' border-2 ' + type.color
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${type.color}`} />
                        <span className="text-xs font-medium">{type.label}</span>
                      </div>
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Spent Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Actual Time Spent (minutes)
              </label>
              <input
                type="number"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder={`Estimated: ${Math.round(task.estimatedDuration / 60)}min`}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                min="1"
                max="480"
              />
            </div>

            {/* Satisfaction Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                How satisfied are you?
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 rounded transition-colors ${
                      rating >= star
                        ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="h-5 w-5" fill={rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Remarks */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quick Remarks
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {quickRemarks.map((remark, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickRemark(remark)}
                    className={`p-2 rounded text-xs text-left transition-colors ${
                      remarks === remark
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {remark}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Remarks */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Custom Remarks
              </label>
              <textarea
                value={customRemarks}
                onChange={(e) => {
                  setCustomRemarks(e.target.value);
                  setRemarks('');
                }}
                placeholder="Add your own notes about completion..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Actions - Sticky at bottom */}
            <div className="sticky bottom-0 bg-inherit pt-4 pb-2 -mx-6 px-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Task</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;