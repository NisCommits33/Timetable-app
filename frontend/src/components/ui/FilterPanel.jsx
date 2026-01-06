/**
 * FilterPanel Component
 * Comprehensive filter panel with all filter options
 */

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const FilterPanel = ({
    filters,
    availableTags,
    onToggleFilter,
    onUpdateFilter,
    onClearFilter,
    onClearAll,
    activeFilterCount,
    isDarkMode
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        priority: true,
        day: false,
        tags: false,
        completion: false,
        dateRange: false,
        timeOfDay: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const categories = ['work', 'personal', 'fitness', 'learning', 'other'];
    const priorities = ['high', 'medium', 'low'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timesOfDay = [
        { value: 'morning', label: 'Morning (5AM-12PM)' },
        { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
        { value: 'evening', label: 'Evening (5PM-9PM)' },
        { value: 'night', label: 'Night (9PM-5AM)' }
    ];

    const FilterSection = ({ title, sectionKey, children }) => (
        <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
                onClick={() => toggleSection(sectionKey)}
                className={`w-full flex items-center justify-between p-3 text-left transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
            >
                <span className="font-medium text-sm">{title}</span>
                {expandedSections[sectionKey] ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>
            {expandedSections[sectionKey] && (
                <div className="p-3 pt-0">
                    {children}
                </div>
            )}
        </div>
    );

    const Checkbox = ({ label, checked, onChange, colorClass = '' }) => (
        <label className="flex items-center space-x-2 cursor-pointer group">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 ${colorClass}`}
            />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                {label}
            </span>
        </label>
    );

    return (
        <div className={`rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearAll}
                        className={`text-sm transition-colors ${isDarkMode
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-700'
                            }`}
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Sections */}
            <div className="max-h-96 overflow-y-auto">
                {/* Category Filter */}
                <FilterSection title="Category" sectionKey="category">
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <Checkbox
                                key={cat}
                                label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                                checked={filters.categories.includes(cat)}
                                onChange={() => onToggleFilter('categories', cat)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Priority Filter */}
                <FilterSection title="Priority" sectionKey="priority">
                    <div className="space-y-2">
                        {priorities.map(pri => (
                            <Checkbox
                                key={pri}
                                label={pri.charAt(0).toUpperCase() + pri.slice(1)}
                                checked={filters.priorities.includes(pri)}
                                onChange={() => onToggleFilter('priorities', pri)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Day Filter */}
                <FilterSection title="Day of Week" sectionKey="day">
                    <div className="space-y-2">
                        {days.map(day => (
                            <Checkbox
                                key={day}
                                label={day}
                                checked={filters.days.includes(day)}
                                onChange={() => onToggleFilter('days', day)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Tags Filter */}
                {availableTags.length > 0 && (
                    <FilterSection title="Tags" sectionKey="tags">
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {availableTags.map(tag => (
                                <Checkbox
                                    key={tag}
                                    label={tag}
                                    checked={filters.tags.includes(tag)}
                                    onChange={() => onToggleFilter('tags', tag)}
                                />
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Completion Status */}
                <FilterSection title="Completion Status" sectionKey="completion">
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="completion"
                                checked={filters.completed === null}
                                onChange={() => onUpdateFilter('completed', null)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                All tasks
                            </span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="completion"
                                checked={filters.completed === false}
                                onChange={() => onUpdateFilter('completed', false)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Not completed
                            </span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="completion"
                                checked={filters.completed === true}
                                onChange={() => onUpdateFilter('completed', true)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Completed
                            </span>
                        </label>
                    </div>
                </FilterSection>

                {/* Date Range */}
                <FilterSection title="Date Range" sectionKey="dateRange">
                    <div className="space-y-3">
                        <div>
                            <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                From
                            </label>
                            <input
                                type="date"
                                value={filters.dateRange?.start || ''}
                                onChange={(e) => onUpdateFilter('dateRange', {
                                    ...filters.dateRange,
                                    start: e.target.value
                                })}
                                className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                To
                            </label>
                            <input
                                type="date"
                                value={filters.dateRange?.end || ''}
                                onChange={(e) => onUpdateFilter('dateRange', {
                                    ...filters.dateRange,
                                    end: e.target.value
                                })}
                                className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                        </div>
                    </div>
                </FilterSection>

                {/* Time of Day */}
                <FilterSection title="Time of Day" sectionKey="timeOfDay">
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="timeOfDay"
                                checked={filters.timeOfDay === null}
                                onChange={() => onUpdateFilter('timeOfDay', null)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Any time
                            </span>
                        </label>
                        {timesOfDay.map(({ value, label }) => (
                            <label key={value} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="timeOfDay"
                                    checked={filters.timeOfDay === value}
                                    onChange={() => onUpdateFilter('timeOfDay', value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            </div>
        </div>
    );
};

export default FilterPanel;
