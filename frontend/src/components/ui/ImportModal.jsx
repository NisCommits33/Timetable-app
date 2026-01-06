/**
 * ImportModal Component
 * Modal for importing tasks from files
 */

import { useState, useRef } from 'react';
import { Upload, FileJson, FileSpreadsheet, X, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { importTasks, validateImportedTasks } from '../utils/importUtils';

const ImportModal = ({ isOpen, onClose, onImport, isDarkMode }) => {
    const [file, setFile] = useState(null);
    const [importResult, setImportResult] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [importMode, setImportMode] = useState('merge'); // 'merge' or 'replace'
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsProcessing(true);
        setImportResult(null);
        setValidationResult(null);

        try {
            const result = await importTasks(selectedFile);
            setImportResult(result);

            if (result.success) {
                const validation = validateImportedTasks(result.tasks);
                setValidationResult(validation);
            }
        } catch (error) {
            setImportResult({
                success: false,
                error: error.message
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImport = () => {
        if (!validationResult || !validationResult.valid) return;

        onImport(validationResult.validTasks, importMode);
        handleClose();
    };

    const handleClose = () => {
        setFile(null);
        setImportResult(null);
        setValidationResult(null);
        setImportMode('merge');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className={`w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}
            >
                {/* Header */}
                <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                    <div className="flex items-center space-x-3">
                        <Upload className="h-6 w-6 text-blue-600" />
                        <div>
                            <h2 className="text-2xl font-bold">Import Tasks</h2>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Upload JSON or CSV file
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* File Upload */}
                    {!file && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDarkMode
                                    ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
                                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                }`}
                        >
                            <Upload className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <h3 className="text-lg font-semibold mb-2">Choose a file to import</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Supports JSON and CSV formats
                            </p>
                            <div className="flex items-center justify-center space-x-4 mt-4">
                                <div className="flex items-center space-x-2">
                                    <FileJson className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm">.json</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                    <span className="text-sm">.csv</span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,.csv"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Processing */}
                    {isProcessing && (
                        <div className="text-center py-8">
                            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p>Processing file...</p>
                        </div>
                    )}

                    {/* Import Result */}
                    {file && !isProcessing && importResult && (
                        <div className="space-y-4">
                            {/* File Info */}
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{file.name}</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {(file.size / 1024).toFixed(2)} KB
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImportResult(null);
                                            setValidationResult(null);
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Change file
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {!importResult.success && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-red-900 dark:text-red-200">Import Failed</div>
                                        <div className="text-sm text-red-800 dark:text-red-300 mt-1">{importResult.error}</div>
                                    </div>
                                </div>
                            )}

                            {/* Validation Results */}
                            {validationResult && (
                                <div className="space-y-4">
                                    {/* Summary */}
                                    <div className={`p-4 rounded-lg ${validationResult.valid
                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                                        }`}>
                                        <div className="flex items-start space-x-3">
                                            {validationResult.valid ? (
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <div className={`font-semibold ${validationResult.valid ? 'text-green-900 dark:text-green-200' : 'text-yellow-900 dark:text-yellow-200'
                                                    }`}>
                                                    {validationResult.valid ? 'Ready to Import' : 'Validation Issues Found'}
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                                                    <div>
                                                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total</div>
                                                        <div className="font-semibold">{validationResult.totalTasks}</div>
                                                    </div>
                                                    <div>
                                                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Valid</div>
                                                        <div className="font-semibold text-green-600">{validationResult.validCount}</div>
                                                    </div>
                                                    <div>
                                                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Invalid</div>
                                                        <div className="font-semibold text-red-600">{validationResult.invalidCount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Errors */}
                                    {validationResult.errors.length > 0 && (
                                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                            <div className="font-semibold mb-2 text-red-600">Errors ({validationResult.errors.length})</div>
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                {validationResult.errors.map((error, index) => (
                                                    <div key={index} className="text-sm text-red-600">• {error}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Warnings */}
                                    {validationResult.warnings.length > 0 && (
                                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                            <div className="font-semibold mb-2 text-yellow-600">Warnings ({validationResult.warnings.length})</div>
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                {validationResult.warnings.map((warning, index) => (
                                                    <div key={index} className="text-sm text-yellow-600">• {warning}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Import Mode */}
                                    {validationResult.validCount > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Import Mode</h3>
                                            <div className="space-y-2">
                                                <label className="flex items-start space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={importMode === 'merge'}
                                                        onChange={() => setImportMode('merge')}
                                                        className="mt-1 w-4 h-4 text-blue-600"
                                                    />
                                                    <div>
                                                        <div className="font-medium">Merge with existing tasks</div>
                                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Add imported tasks to your current tasks
                                                        </div>
                                                    </div>
                                                </label>
                                                <label className="flex items-start space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={importMode === 'replace'}
                                                        onChange={() => setImportMode('replace')}
                                                        className="mt-1 w-4 h-4 text-blue-600"
                                                    />
                                                    <div>
                                                        <div className="font-medium">Replace all tasks</div>
                                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Delete current tasks and import new ones (⚠️ cannot be undone)
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {file && validationResult && validationResult.validCount > 0 && (
                    <div className={`sticky bottom-0 flex items-center justify-end space-x-3 p-6 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                        }`}>
                        <button
                            onClick={handleClose}
                            className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleImport}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Upload className="h-4 w-4" />
                            <span>Import {validationResult.validCount} Task{validationResult.validCount !== 1 ? 's' : ''}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportModal;
