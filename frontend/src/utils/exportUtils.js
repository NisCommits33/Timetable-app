/**
 * Export Utility Module
 * Handles exporting tasks in multiple formats
 */

/**
 * Export tasks to JSON format
 * @param {Array} tasks - Array of task objects
 * @returns {Blob} - JSON blob for download
 */
export const exportToJSON = (tasks) => {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        taskCount: tasks.length,
        tasks: tasks
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
};

/**
 * Export tasks to CSV format
 * @param {Array} tasks - Array of task objects
 * @returns {Blob} - CSV blob for download
 */
export const exportToCSV = (tasks) => {
    // CSV headers
    const headers = [
        'ID',
        'Title',
        'Description',
        'Day',
        'Date',
        'Start Time',
        'End Time',
        'Category',
        'Priority',
        'Completed',
        'Tags',
        'Location',
        'Notes'
    ];

    // Convert tasks to CSV rows
    const rows = tasks.map(task => [
        task.id,
        `"${task.title || ''}"`,
        `"${task.description || ''}"`,
        task.day || '',
        task.date || '',
        task.startTime || '',
        task.endTime || '',
        task.category || '',
        task.priority || '',
        task.completed ? 'Yes' : 'No',
        `"${task.tags?.join(', ') || ''}"`,
        `"${task.location || ''}"`,
        `"${task.notes || ''}"`
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Export tasks to iCal format (.ics)
 * @param {Array} tasks - Array of task objects
 * @returns {Blob} - iCal blob for download
 */
export const exportToICalendar = (tasks) => {
    const ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Timetable App//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Timetable App Tasks',
        'X-WR-TIMEZONE:UTC'
    ];

    tasks.forEach(task => {
        const startDateTime = `${task.date}T${task.startTime.replace(':', '')}00`;
        const endDateTime = `${task.date}T${task.endTime.replace(':', '')}00`;
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        ical.push(
            'BEGIN:VEVENT',
            `UID:${task.id}@timetableapp.com`,
            `DTSTAMP:${timestamp}`,
            `DTSTART:${startDateTime}`,
            `DTEND:${endDateTime}`,
            `SUMMARY:${task.title}`,
            task.description ? `DESCRIPTION:${task.description}` : '',
            task.location ? `LOCATION:${task.location}` : '',
            `CATEGORIES:${task.category}`,
            `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}`,
            `STATUS:${task.completed ? 'COMPLETED' : 'NEEDS-ACTION'}`,
            'END:VEVENT'
        );
    });

    ical.push('END:VCALENDAR');

    const icalContent = ical.filter(line => line).join('\r\n');
    return new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
};

/**
 * Trigger download of a blob
 * @param {Blob} blob - Data blob
 * @param {string} filename - Desired filename
 */
export const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Export tasks with selected format
 * @param {Array} tasks - Tasks to export
 * @param {string} format - 'json' | 'csv' | 'ical'
 */
export const exportTasks = (tasks, format = 'json') => {
    const timestamp = new Date().toISOString().split('T')[0];
    let blob, filename;

    switch (format.toLowerCase()) {
        case 'csv':
            blob = exportToCSV(tasks);
            filename = `timetable-tasks-${timestamp}.csv`;
            break;
        case 'ical':
        case 'ics':
            blob = exportToICalendar(tasks);
            filename = `timetable-tasks-${timestamp}.ics`;
            break;
        case 'json':
        default:
            blob = exportToJSON(tasks);
            filename = `timetable-backup-${timestamp}.json`;
            break;
    }

    downloadBlob(blob, filename);
};

export default {
    exportToJSON,
    exportToCSV,
    exportToICalendar,
    exportTasks,
    downloadBlob
};
