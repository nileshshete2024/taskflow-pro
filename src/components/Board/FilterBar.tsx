import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ASSIGNEES, PRESET_LABELS } from '../../utils/helpers';
import type { Priority } from '../../types';

export const FilterBar = () => {
  const { filters, setFilter, resetFilters } = useAppStore();

  const hasActiveFilters =
    filters.priority !== 'all' ||
    filters.assignee !== 'all' ||
    filters.label !== 'all' ||
    filters.search !== '';

  return (
    <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="Search tasks..."
            className="input pl-9 py-1.5 text-xs h-8"
          />
        </div>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={(e) => setFilter({ priority: e.target.value as Priority | 'all' })}
          className="input text-xs h-8 py-0 w-32"
        >
          <option value="all">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Assignee filter */}
        <select
          value={filters.assignee}
          onChange={(e) => setFilter({ assignee: e.target.value })}
          className="input text-xs h-8 py-0 w-32"
        >
          <option value="all">All assignees</option>
          {ASSIGNEES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Label filter */}
        <select
          value={filters.label}
          onChange={(e) => setFilter({ label: e.target.value })}
          className="input text-xs h-8 py-0 w-28"
        >
          <option value="all">All labels</option>
          {PRESET_LABELS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
