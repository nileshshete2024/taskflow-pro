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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Data
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleExportJSON}
            className="w-full btn btn-primary py-2 text-left flex items-center gap-3"
          >
            <Download className="w-4 h-4" />
            Export as JSON
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 ml-3">
            Backup all tasks and projects as a JSON file
          </p>
          <button
            onClick={handleExportCSV}
            className="w-full btn btn-secondary py-2 text-left flex items-center gap-3 mt-4"
          >
            <Download className="w-4 h-4" />
            Export Tasks as CSV
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 ml-3">
            Export tasks in CSV format for spreadsheets
          </p>
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
      <section className="card p-6 border-red-200 dark:border-red-900">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Danger Zone
        </h2>
        <button
          onClick={handleResetData}
          className="w-full btn py-2 text-left flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Data
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 ml-3 mt-2">
          This will clear all tasks, projects, and settings. This action cannot be undone.
        </p>
      </section>
    </div>
  );
};
