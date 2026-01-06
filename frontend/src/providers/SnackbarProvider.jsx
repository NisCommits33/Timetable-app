import React, { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const showSnackbar = (message, options = {}) => {
    const id = Date.now() + Math.random();
    const snackbar = {
      id,
      message,
      type: options.type || 'default',
      duration: options.duration || 4000,
      action: options.action,
      ...options
    };

    setSnackbars(prev => [...prev, snackbar]);

    // Auto remove after duration
    setTimeout(() => {
      removeSnackbar(id);
    }, snackbar.duration);

    return id;
  };

  const removeSnackbar = (id) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  };

  // Convenience methods
  const success = (message, options) => showSnackbar(message, { ...options, type: 'success' });
  const warning = (message, options) => showSnackbar(message, { ...options, type: 'warning' });
  const error = (message, options) => showSnackbar(message, { ...options, type: 'error' });
  const info = (message, options) => showSnackbar(message, { ...options, type: 'info' });

  const value = {
    snackbars,
    showSnackbar,
    removeSnackbar,
    success,
    warning,
    error,
    info
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
};