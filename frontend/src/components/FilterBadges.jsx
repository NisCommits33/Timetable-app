/**
 * FilterBadges Component  
 * Displays active filters as removable badges
 */

import { X } from 'lucide-react';

const FilterBadges = ({ filterSummary, onClearFilter, onClearSearch, isDarkMode }) => {
    if (filterSummary.length === 0) return null;

    const getBadgeColor = (type) => {
        switch (type) {
            case 'search':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800';
            case 'category':
                return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800';
            case 'priority':
                return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800';
            case 'day':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800';
            case 'tag':
                return 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800';
            case 'completed':
                return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-800';
            case 'dateRange':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800';
            case 'timeOfDay':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
        }
    };

    const handleRemove = (filter) => {
        if (filter.type === 'search') {
            onClearSearch();
        } else if (filter.type === 'category') {
            onClearFilter('categories', filter.value);
        } else if (filter.type === 'priority') {
            onClearFilter('priorities', filter.value);
        } else if (filter.type === 'day') {
            onClearFilter('days', filter.value);
        } else if (filter.type === 'tag') {
            onClearFilter('tags', filter.value);
        } else if (filter.type === 'completed') {
            onClearFilter('completed', null);
        } else if (filter.type === 'dateRange') {
            onClearFilter('dateRange', null);
        } else if (filter.type === 'timeOfDay') {
            onClearFilter('timeOfDay', null);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {filterSummary.map((filter, index) => (
                <span
                    key={`${filter.type}-${index}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getBadgeColor(filter.type)}`}
                >
                    {filter.label}
                    <button
                        onClick={() => handleRemove(filter)}
                        className="ml-2 hover:opacity-70 transition-opacity"
                        aria-label={`Remove ${filter.label} filter`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </span>
            ))}
        </div>
    );
};

export default FilterBadges;
