import { useAppStore } from '../store/useAppStore';
import { exportTasksToJSON, exportTasksToCSV } from '../utils/exportUtils';
import { Download, Moon, Sun, RotateCcw, AlertCircle } from 'lucide-react';

export const SettingsPage = () => {
  const { tasks, projects, darkMode, toggleDarkMode } = useAppStore();

  const handleExportJSON = () => {
    exportTasksToJSON(tasks, projects);
  };

  const handleExportCSV = () => {
    exportTasksToCSV(tasks);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your preferences and data</p>
        </div>

      {/* Appearance Section */}
      <section className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Toggle dark mode theme</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-primary-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Export Section */}
      <section className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Data
        </h2>
        <div className="space-y-4">
          <div>
            <button
              onClick={handleExportJSON}
              className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center gap-3 transition-colors"
              type="button"
              aria-label="Export tasks and projects as JSON backup file"
            >
              <Download className="w-4 h-4" />
              Export as JSON
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1">
              Backup all tasks and projects as a JSON file
            </p>
          </div>
          <div>
            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg flex items-center gap-3 transition-colors"
              type="button"
              aria-label="Export tasks in CSV format for spreadsheet applications"
            >
              <Download className="w-4 h-4" />
              Export Tasks as CSV
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1">
              Export tasks in CSV format for spreadsheets
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Projects</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{projects.length}</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">
              {tasks.filter((t) => t.status === 'done').length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
            <p className="text-2xl font-bold text-orange-600">
              {tasks.filter((t) => t.status === 'in-progress').length}
            </p>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="card p-6 mb-6 border-2 border-red-200 dark:border-red-900/50">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Danger Zone
        </h2>
        <button
          onClick={handleResetData}
          type="button"
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center gap-3 transition-colors"
          aria-label="Reset all data to default state - this action cannot be undone"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Data
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 ml-1">
          This will clear all tasks, projects, and settings. This action cannot be undone.
        </p>
      </section>
      </div>
    </div>
  );
};
