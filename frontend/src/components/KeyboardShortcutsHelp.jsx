/**
 * KeyboardShortcutsHelp Modal
 * Displays all available keyboard shortcuts
 */

import { X } from 'lucide-react';
import { shortcutCategories } from '../hooks/useKeyboardShortcuts';

const KeyboardShortcutsHelp = ({ isOpen, onClose, isDarkMode }) => {
    if (!isOpen) return null;

    const KeyBadge = ({ keyName }) => (
        <kbd className={`px-2 py-1 text-xs font-semibold rounded border ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-gray-100 border-gray-300 text-gray-800'
            }`}>
            {keyName}
        </kbd>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}
            >
                {/* Header */}
                <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                    <div>
                        <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Boost your productivity with these shortcuts
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Shortcuts List */}
                <div className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {shortcutCategories.map((category) => (
                            <div key={category.name}>
                                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    }`}>
                                    {category.name}
                                </h3>
                                <div className="space-y-2">
                                    {category.shortcuts.map((shortcut, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                                                }`}
                                        >
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {shortcut.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, keyIndex) => (
                                                    <span key={keyIndex} className="flex items-center gap-1">
                                                        <KeyBadge keyName={key} />
                                                        {keyIndex < shortcut.keys.length - 1 && (
                                                            <span className={`text-xs mx-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                +
                                                            </span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Tip */}
                    <div className={`mt-6 p-4 rounded-lg border ${isDarkMode
                            ? 'bg-blue-900/20 border-blue-800 text-blue-200'
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                        }`}>
                        <p className="text-sm">
                            <strong>💡 Tip:</strong> Press <KeyBadge keyName="?" /> anytime to view this help dialog.
                            Most shortcuts work on selected or hovered tasks.
                        </p>
                    </div>
                </div>

                {/* Close Button */}
                <div className={`sticky bottom-0 p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsHelp;
