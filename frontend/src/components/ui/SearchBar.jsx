/**
 * SearchBar Component
 * Real-time search input with debouncing and clear functionality
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search tasks...", isDarkMode }) => {
    const [localValue, setLocalValue] = useState('');
    const debounceTimer = useRef(null);

    // Debounced search - only trigger after user stops typing for 300ms
    useEffect(() => {
        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new timer
        debounceTimer.current = setTimeout(() => {
            onSearch(localValue);
        }, 300);

        // Cleanup
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [localValue, onSearch]);

    const handleClear = () => {
        setLocalValue('');
        onSearch('');
    };

    return (
        <div className="relative">
            <div className="relative flex items-center">
                {/* Search Icon */}
                <Search
                    className={`absolute left-3 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                />

                {/* Input Field */}
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }`}
                />

                {/* Clear Button */}
                {localValue && (
                    <button
                        onClick={handleClear}
                        className={`absolute right-3 p-1 rounded-full transition-colors ${isDarkMode
                                ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200'
                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                            }`}
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Search hint */}
            {localValue && (
                <div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Press Enter or wait to search
                </div>
            )}
        </div>
    );
};

export default SearchBar;
