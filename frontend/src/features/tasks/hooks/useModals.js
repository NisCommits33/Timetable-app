/**
 * Custom Hook: useModals
 * Centralized modal state management
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing multiple modals in the app
 * @returns {Object} - Modal states and control functions
 */
export const useModals = () => {
    // Detail Modal (for viewing task details)
    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        task: null
    });

    // Edit Modal (for editing tasks)
    const [editModal, setEditModal] = useState({
        isOpen: false,
        task: null
    });

    // Completion Modal (for marking tasks complete with details)
    const [completionModal, setCompletionModal] = useState({
        isOpen: false,
        task: null
    });

    // Add Task Modal (optional, if you want to make the form a modal)
    const [addTaskModal, setAddTaskModal] = useState({
        isOpen: false,
        prefillData: null
    });

    // Delete Confirmation Modal
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        task: null,
        onConfirm: null
    });

    // Generic Confirmation Modal
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null
    });

    /**
     * Open detail modal for a task
     * @param {Object} task - Task to view
     */
    const openDetailModal = useCallback((task) => {
        setDetailModal({ isOpen: true, task });
    }, []);

    /**
     * Close detail modal
     */
    const closeDetailModal = useCallback(() => {
        setDetailModal({ isOpen: false, task: null });
    }, []);

    /**
     * Open edit modal for a task
     * @param {Object} task - Task to edit
     */
    const openEditModal = useCallback((task) => {
        setEditModal({ isOpen: true, task });
    }, []);

    /**
     * Close edit modal
     */
    const closeEditModal = useCallback(() => {
        setEditModal({ isOpen: false, task: null });
    }, []);

    /**
     * Open completion modal for a task
     * @param {Object} task - Task to mark complete
     */
    const openCompletionModal = useCallback((task) => {
        setCompletionModal({ isOpen: true, task });
    }, []);

    /**
     * Close completion modal
     */
    const closeCompletionModal = useCallback(() => {
        setCompletionModal({ isOpen: false, task: null });
    }, []);

    /**
     * Open add task modal
     * @param {Object} prefillData - Optional data to prefill the form
     */
    const openAddTaskModal = useCallback((prefillData = null) => {
        setAddTaskModal({ isOpen: true, prefillData });
    }, []);

    /**
     * Close add task modal
     */
    const closeAddTaskModal = useCallback(() => {
        setAddTaskModal({ isOpen: false, prefillData: null });
    }, []);

    /**
     * Open delete confirmation modal
     * @param {Object} task - Task to delete
     * @param {Function} onConfirm - Callback for confirmation
     */
    const openDeleteModal = useCallback((task, onConfirm) => {
        setDeleteModal({
            isOpen: true,
            task,
            onConfirm
        });
    }, []);

    /**
     * Close delete modal
     */
    const closeDeleteModal = useCallback(() => {
        setDeleteModal({
            isOpen: false,
            task: null,
            onConfirm: null
        });
    }, []);

    /**
     * Open generic confirmation modal
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @param {Function} onConfirm - Callback for confirmation
     * @param {Function} onCancel - Optional callback for cancel
     */
    const openConfirmModal = useCallback((title, message, onConfirm, onCancel = null) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm,
            onCancel
        });
    }, []);

    /**
     * Close confirmation modal
     */
    const closeConfirmModal = useCallback(() => {
        setConfirmModal({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null,
            onCancel: null
        });
    }, []);

    /**
     * Close all modals at once
     */
    const closeAllModals = useCallback(() => {
        closeDetailModal();
        closeEditModal();
        closeCompletionModal();
        closeAddTaskModal();
        closeDeleteModal();
        closeConfirmModal();
    }, []);

    /**
     * Transition from one modal to another
     * Useful for "Edit" button in detail modal
     * @param {string} from - Source modal ('detail', 'edit', etc.)
     * @param {string} to - Target modal
     * @param {Object} task - Task to pass to new modal
     */
    const transitionModal = useCallback((from, to, task) => {
        // Close the source modal
        switch (from) {
            case 'detail':
                closeDetailModal();
                break;
            case 'edit':
                closeEditModal();
                break;
            case 'completion':
                closeCompletionModal();
                break;
            default:
                break;
        }

        // Open the target modal with a slight delay for smooth transition
        setTimeout(() => {
            switch (to) {
                case 'detail':
                    openDetailModal(task);
                    break;
                case 'edit':
                    openEditModal(task);
                    break;
                case 'completion':
                    openCompletionModal(task);
                    break;
                default:
                    break;
            }
        }, 100);
    }, []);

    return {
        // States
        detailModal,
        editModal,
        completionModal,
        addTaskModal,
        deleteModal,
        confirmModal,

        // Control functions
        openDetailModal,
        closeDetailModal,
        openEditModal,
        closeEditModal,
        openCompletionModal,
        closeCompletionModal,
        openAddTaskModal,
        closeAddTaskModal,
        openDeleteModal,
        closeDeleteModal,
        openConfirmModal,
        closeConfirmModal,
        closeAllModals,
        transitionModal
    };
};

export default useModals;
