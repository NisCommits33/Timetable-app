/**
 * ExportModal Component
 * Modal for exporting tasks in various formats
 */

import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Calendar, X } from 'lucide-react';
import { exportTasks } from '../utils/exportUtils';

const ExportModal = ({ isOpen, onClose, tasks, isDarkMode }) => {
    const [selectedFormat, setSelectedFormat] = useState('json');
    const [includeCompleted, setIncludeCompleted] = useState(true);

    if (!isOpen) return null;

    const formats = [
        {
            id: 'json',
            name: 'JSON',
            description: 'Full backup with all task data',
            icon: FileJson,
            extension: '.json',
            color: 'text-blue-600'
        },
        {
            id: 'csv',
            name: 'CSV',
            description: 'Spreadsheet format (Excel, Google Sheets)',
            icon: FileSpreadsheet,
            extension: '.csv',
            color: 'text-green-600'
        },
        {
            id: 'ical',
            name: 'iCalendar',
            description: 'Import to calendar apps (Google, Apple, Outlook)',
            icon: Calendar,
            extension: '.ics',
            color: 'text-purple-600'
        }
    ];

    const handleExport = () => {
        const tasksToExport = includeCompleted
            ? tasks
            : tasks.filter(task => !task.completed);

        exportTasks(tasksToExport, selectedFormat);
        onClose();
    };

    const selectedFormatData = formats.find(f => f.id === selectedFormat);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className={`w-full max-w-2xl rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <div className="flex items-center space-x-3">
                        <Download className="h-6 w-6 text-blue-600" />
                        <div>
                            <h2 className="text-2xl font-bold">Export Tasks</h2>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Download your tasks in your preferred format
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Format Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Select Format</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {formats.map((format) => {
                                const Icon = format.icon;
                                return (
                                    <button
                                        key={format.id}
                                        onClick={() => setSelectedFormat(format.id)}
                                        className={`p-4 rounded-lg border-2 transition-all text-left ${selectedFormat === format.id
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                                : isDarkMode
                                                    ? 'border-gray-700 hover:border-gray-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className={`h-8 w-8 mb-2 ${format.color}`} />
                                        <div className="font-semibold">{format.name}</div>
                                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {format.description}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Export Options</h3>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeCompleted}
                                onChange={(e) => setIncludeCompleted(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Include completed tasks</span>
                        </label>
                    </div>

                    {/* Export Summary */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Export Summary</span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total tasks:</span>
                                <span className="font-semibold">{tasks.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>To be exported:</span>
                                <span className="font-semibold">
                                    {includeCompleted ? tasks.length : tasks.filter(t => !t.completed).length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Format:</span>
                                <span className="font-semibold">{selectedFormatData?.name} ({selectedFormatData?.extension})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-end space-x-3 p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
