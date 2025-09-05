// src/components/AddTaskForm.jsx
import { useState } from 'react';
import DatePicker from 'react-datepicker'; // 1. Import the date picker
import { format, parse } from 'date-fns'; // 2. Import date-fns functions
import 'react-datepicker/dist/react-datepicker.css'; // 3. Import the CSS for the date picker

function AddTaskForm({ onAddTask }) {
  // State for form fields
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  // 4. Change state to hold a Date object instead of a string
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [priority, setPriority] = useState('High');
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 5. Format the selected Date object into an ISO string for storage
    const dateIsoString = format(selectedDate, 'yyyy-MM-dd');
    // 6. Use date-fns to get the day name from the selected date
    const dayName = format(selectedDate, 'EEEE'); // 'EEEE' gives the full day name (e.g., "Monday")

    // 7. Create the new task object
    const newTask = {
      id: Date.now(), // Simple way to generate a unique ID
      title,
      startTime,
      endTime,
      date: dateIsoString, // e.g., "2025-08-28"
      day: dayName        // e.g., "Thursday"
    };

    console.log('New Task to Add:', newTask); // Let's check it before we send
    // onAddTask(newTask); // We'll uncomment this in the next step

    // 8. Reset the form (optional)
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setSelectedDate(new Date());
  };

  // In AddTaskForm.jsx, replace the return statement with this:
return (
  <form onSubmit={handleSubmit} className="add-task-form p-4 border rounded-lg shadow-sm bg-white mb-4">
    <h3 className="text-lg font-semibold mb-3">Add New Task</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {/* Task Title */}
      <label className="block">
        <span className="text-gray-700 text-sm">Task Title*</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
          required
        />
      </label>

      {/* Date Picker */}
      <label className="block">
        <span className="text-gray-700 text-sm">Date*</span>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM d, yyyy"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
          required
        />
      </label>

      {/* Start Time */}
      <label className="block">
        <span className="text-gray-700 text-sm">Start Time*</span>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
          required
        />
      </label>

      {/* End Time */}
      <label className="block">
        <span className="text-gray-700 text-sm">End Time*</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
          required
        />
      </label>
      <label className="block">
        <span className="text-gray-700 text-sm">Priority*</span>
        <input
          type="dropdown"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
          required
        />
      </label>
    </div>

    <button
      type="submit"
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      Add Task
    </button>
  </form>
);
}

export default AddTaskForm;