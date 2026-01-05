/**
 * Custom Hook: useKeyboardShortcuts
 * Manages global keyboard shortcuts for the application
 */

import { useEffect, useCallback } from 'react';

/**
 * Hook for managing keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to handlers
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export const useKeyboardShortcuts = (shortcuts, enabled = true) => {
    const handleKeyDown = useCallback((event) => {
        if (!enabled) return;

        // Build the key combination string
        const key = event.key.toLowerCase();
        const ctrl = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd (Mac)
        const shift = event.shiftKey;
        const alt = event.altKey;

        // Don't trigger shortcuts when typing in inputs/textareas
        const target = event.target;
        const isTyping =
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable;

        // Some shortcuts should work even when typing (e.g., Escape)
        const alwaysActive = ['escape', 'esc'];

        if (isTyping && !alwaysActive.includes(key)) {
            // Allow Ctrl+K for search even in input fields
            if (!(ctrl && key === 'k')) {
                return;
            }
        }

        // Check each shortcut
        for (const [combo, handler] of Object.entries(shortcuts)) {
            if (matchesShortcut(combo, { key, ctrl, shift, alt })) {
                event.preventDefault();
                handler(event);
                break;
            }
        }
    }, [shortcuts, enabled]);

    useEffect(() => {
        if (enabled) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleKeyDown, enabled]);
};

/**
 * Check if a key event matches a shortcut combination
 */
const matchesShortcut = (combo, { key, ctrl, shift, alt }) => {
    const parts = combo.toLowerCase().split('+').map(p => p.trim());

    const hasCtrl = parts.includes('ctrl') || parts.includes('cmd');
    const hasShift = parts.includes('shift');
    const hasAlt = parts.includes('alt');
    const mainKey = parts.find(p => !['ctrl', 'cmd', 'shift', 'alt'].includes(p));

    return (
        key === mainKey &&
        ctrl === hasCtrl &&
        shift === hasShift &&
        alt === hasAlt
    );
};

/**
 * Default shortcuts configuration
 */
export const defaultShortcuts = {
    // Navigation
    'ctrl+1': 'switchToWeekView',
    'ctrl+2': 'switchToDayView',
    'ctrl+3': 'switchToListView',
    'ctrl+4': 'switchToBoardView',
    'ctrl+5': 'switchToTimelineView',

    // Actions
    'ctrl+k': 'focusSearch',
    'ctrl+f': 'toggleFilters',
    'n': 'newTask',
    'shift+n': 'openAddTaskForm',
    '/': 'focusSearch',

    // Task actions
    'e': 'editTask',
    'd': 'deleteTask',
    'c': 'completeTask',
    'enter': 'openTaskDetails',

    // Modals
    'escape': 'closeModal',

    // Other
    '?': 'showShortcutsHelp',
    'ctrl+b': 'toggleDarkMode',
    'f': 'startFocus',
    't': 'startTimer',
};

/**
 * Shortcut categories for help display
 */
export const shortcutCategories = [
    {
        name: 'Navigation',
        shortcuts: [
            { keys: ['Ctrl', '1'], description: 'Switch to Week View' },
            { keys: ['Ctrl', '2'], description: 'Switch to Day View' },
            { keys: ['Ctrl', '3'], description: 'Switch to List View' },
            { keys: ['Ctrl', '4'], description: 'Switch to Board View' },
            { keys: ['Ctrl', '5'], description: 'Switch to Timeline View' },
        ]
    },
    {
        name: 'Search & Filter',
        shortcuts: [
            { keys: ['Ctrl', 'K'], description: 'Focus search bar' },
            { keys: ['/'], description: 'Focus search bar (alternative)' },
            { keys: ['Ctrl', 'F'], description: 'Toggle filter panel' },
        ]
    },
    {
        name: 'Task Actions',
        shortcuts: [
            { keys: ['N'], description: 'Create new task (quick form)' },
            { keys: ['Shift', 'N'], description: 'Create new task (full form)' },
            { keys: ['E'], description: 'Edit selected/hovered task' },
            { keys: ['D'], description: 'Delete selected/hovered task' },
            { keys: ['C'], description: 'Mark task as complete' },
            { keys: ['Enter'], description: 'Open task details' },
            { keys: ['F'], description: 'Start focus timer' },
            { keys: ['T'], description: 'Start time tracking' },
        ]
    },
    {
        name: 'General',
        shortcuts: [
            { keys: ['Escape'], description: 'Close modal or dialog' },
            { keys: ['Ctrl', 'B'], description: 'Toggle dark mode' },
            { keys: ['?'], description: 'Show keyboard shortcuts help' },
        ]
    }
];

export default useKeyboardShortcuts;
