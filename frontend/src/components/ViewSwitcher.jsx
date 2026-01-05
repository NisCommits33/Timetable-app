// components/ViewSwitcher.jsx
import { Calendar, List, Clock, Grid, BarChart3, TrendingUp } from 'lucide-react';

const ViewSwitcher = ({ currentView, onViewChange, isDarkMode }) => {
  const views = [
    { id: 'week', name: 'Week View', icon: Calendar, description: '7-day weekly layout' },
    { id: 'day', name: 'Day View', icon: Clock, description: 'Detailed daily schedule' },
    { id: 'list', name: 'List View', icon: List, description: 'Simple task checklist' },
    { id: 'board', name: 'Board View', icon: Grid, description: 'Kanban-style columns' },
    { id: 'timeline', name: 'Timeline', icon: BarChart3, description: 'Gantt-style timeline' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, description: 'Task statistics and insights' }
  ];

  return (
    <div className={`flex flex-wrap gap-2 p-4 rounded-lg border ${
      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.id;
        
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 flex-1 min-w-[140px] ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
            title={view.description}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{view.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewSwitcher;