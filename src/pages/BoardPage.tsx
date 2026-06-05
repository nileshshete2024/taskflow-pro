import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { KanbanBoard } from '../components/Board/KanbanBoard';
import { FilterBar } from '../components/Board/FilterBar';
import { NewTaskModal } from '../components/Task/NewTaskModal';
import { TaskDetailModal } from '../components/Task/TaskDetailModal';
import { useProjectStats } from '../hooks/useTasks';
import { Plus, LayoutGrid, CheckCircle2, Clock } from 'lucide-react';
import type { Task } from '../types';

export const BoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useAppStore();
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const project = projects.find((p) => p.id === projectId);
  const stats = useProjectStats(projectId ?? '');

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400">Project not found</p>
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
            {/* Quick stats */}
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
              onClick={() => setShowNewTask(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add task
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

      {/* Filters */}
      <FilterBar />

      {/* Board */}
      <KanbanBoard
        projectId={project.id}
        onTaskClick={setSelectedTask}
      />


      {showNewTask && (
        <NewTaskModal
          projectId={project.id}
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
