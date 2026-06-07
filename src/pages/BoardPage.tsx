import { useState, useCallback, useOptimistic, startTransition } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { KanbanBoard } from '../components/Board/KanbanBoard';
import { FilterBar } from '../components/Board/FilterBar';
import { NewTaskModal } from '../components/Task/NewTaskModal';
import { TaskDetailModal } from '../components/Task/TaskDetailModal';
import { useProjectStats } from '../hooks/useTasks';
import { usePageTitle } from '../hooks/usePageTitle';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Plus, LayoutGrid, CheckCircle2, Clock, Keyboard } from 'lucide-react';
import type { Task, TaskStatus } from '../types';

export const BoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, tasks, moveTask } = useAppStore();
  const [showNewTask, setShowNewTask] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  const stats = useProjectStats(projectId ?? '');

  // React 19: useOptimistic for task status changes — UI updates instantly, no flicker
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const [optimisticTasks, addOptimisticMove] = useOptimistic(
    projectTasks,
    (state, { taskId, newStatus }: { taskId: string; newStatus: TaskStatus }) =>
      state.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
  );

  const handleOptimisticMove = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      startTransition(() => {
        addOptimisticMove({ taskId, newStatus });
        moveTask(taskId, newStatus);
      });
    },
    [addOptimisticMove, moveTask]
  );

  usePageTitle(project?.name ?? '');

  const openNewTask = useCallback((status: TaskStatus = 'todo') => {
    setDefaultStatus(status);
    setShowNewTask(true);
  }, []);

  useKeyboardShortcuts({
    n: () => openNewTask('todo'),
    escape: () => { setShowNewTask(false); setSelectedTask(null); },
    '?': () => setShowShortcuts((v) => !v),
  });

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Project not found</p>
          <p className="text-sm text-slate-400 mt-1">It may have been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: project.color + '20' }}
            >
              {project.icon}
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{stats.total} tasks</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600">
                <Clock className="w-3.5 h-3.5" />
                <span>{stats.inProgress} active</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stats.completion}% done</span>
              </div>
            </div>

            <button
              onClick={() => setShowShortcuts((v) => !v)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <button onClick={() => openNewTask('todo')} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add task
              <span className="text-primary-200 text-xs font-mono ml-1">N</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${stats.completion}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Keyboard shortcuts panel */}
      {showShortcuts && (
        <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-6 py-2.5">
          <div className="flex items-center gap-6 text-xs text-amber-800 dark:text-amber-300 flex-wrap">
            <span className="font-medium">Keyboard shortcuts:</span>
            {[
              ['N', 'New task'],
              ['Esc', 'Close modal'],
              ['?', 'Toggle shortcuts'],
            ].map(([key, label]) => (
              <span key={key} className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {key}
                </kbd>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <FilterBar />

      {/* Board — pass optimistic tasks + handler */}
      <KanbanBoard
        projectId={project.id}
        optimisticTasks={optimisticTasks}
        onOptimisticMove={handleOptimisticMove}
        onTaskClick={setSelectedTask}
        onAddTask={openNewTask}
      />

      {showNewTask && (
        <NewTaskModal
          projectId={project.id}
          defaultStatus={defaultStatus}
          onClose={() => setShowNewTask(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdate={(updatedTask) => setSelectedTask(updatedTask)}
        />
      )}
    </div>
  );
};
