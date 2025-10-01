<NotificationProvider tasks={tasks}>
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
        
        {/* Header Section - Add NotificationCenter */}
        <header className={`border-b transition-colors duration-200 ${
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and App Name */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-7 w-7 text-blue-600" />
                <h1 className="text-xl font-semibold">Timetable App</h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* Notification Center */}
                <NotificationCenter isDarkMode={isDarkMode} />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                {/* New Task Button */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Add Task Form */}
          <div className="lg:col-span-1">
            <div
              className={`p-5 rounded-xl border transition-colors duration-200 sticky top-1 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
              <AddTaskForm onAddTask={addTask} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Main Content - Week View */}
          <div className="lg:col-span-3">
            <div
              className={`p-6 rounded-xl border transition-colors duration-200 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Weekly Schedule</h2>
                {selectedDay && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode
                        ? "bg-blue-900/20 text-blue-300"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    Viewing: {selectedDay}
                  </span>
                )}
              </div>

              <WeekView
                tasks={tasks}
                onDayClick={handleDayClick}
                selectedDay={selectedDay}
                onDeleteTask={deleteTask}
                onEditTask={handleEditTask}
                onViewDetails={handleViewDetails}
                onTaskMove={handleTaskMove} // NEW
                isDarkMode={isDarkMode}
                onToggleTracking={toggleTracking} // NEW
                onAddManualTime={addManualTime} // NEW
                onResetTracking={resetTracking} // NEW
              />
            </div>
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      <TaskDetailModal
        open={detailModalOpen}
        task={selectedTask}
        onClose={() => setDetailModalOpen(false)}
        onEdit={(task) => {
          setDetailModalOpen(false);
          handleEditTask(task);
        }}
        onDelete={(taskId) => {
          setDetailModalOpen(false);
          deleteTask(taskId);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Edit Task Modal */}
      {isEditModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Edit className="h-5 w-5 mr-2 text-blue-600" />
                Edit Task
              </h3>
              <button
                onClick={handleCloseEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Task Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                      : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editingTask.startTime}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        startTime: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                        : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editingTask.endTime}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        endTime: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                        : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Day of Week
                </label>
                <select
                  value={editingTask.day}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, day: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                      : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
                  }`}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseEdit}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingTask)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </NotificationProvider>