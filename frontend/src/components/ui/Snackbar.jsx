import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useSnackbar } from '../../providers/SnackbarProvider';

const Snackbar = () => {
  const { snackbars, removeSnackbar } = useSnackbar();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStyles = (type) => {
    const baseStyles = "flex items-center justify-between p-4 rounded-lg shadow-lg border min-w-80 max-w-md transform transition-all duration-300";

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  if (snackbars.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {snackbars.map((snackbar, index) => (
        <div
          key={snackbar.id}
          className={getStyles(snackbar.type)}
          style={{
            transform: `translateY(${index * -10}px)`,
            opacity: 1 - (index * 0.2)
          }}
        >
          <div className="flex items-center space-x-3">
            {getIcon(snackbar.type)}
            <div className="flex-1">
              <p className="text-sm font-medium">{snackbar.message}</p>
              {snackbar.action && (
                <button
                  onClick={() => {
                    snackbar.action.onClick();
                    removeSnackbar(snackbar.id);
                  }}
                  className="text-xs font-semibold underline mt-1"
                >
                  {snackbar.action.label}
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => removeSnackbar(snackbar.id)}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Snackbar;