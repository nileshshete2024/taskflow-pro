import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { COLUMN_CONFIG } from '../../utils/helpers';
import { TaskCard } from '../Task/TaskCard';
import type { Task, TaskStatus } from '../../types';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn = ({ status, tasks, onTaskClick, onAddTask }: Props) => {
  const config = COLUMN_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col w-72 flex-shrink-0 h-full">
      {/* Column header */}
      <div className={clsx('flex items-center justify-between px-3 py-2.5 rounded-xl mb-3', config.bg)}>
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', config.dot)} />
          <span className={clsx('text-sm font-semibold', config.color)}>{config.title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20', config.color)}>
            {tasks.length}
          </span>
          <button
            onClick={() => onAddTask(status)}
            className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-white/80 dark:hover:bg-black/20 transition-colors"
            title={`Add task to ${config.title}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task list */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={clsx(
            'flex-1 overflow-y-auto space-y-3 rounded-xl p-2 transition-colors min-h-[200px]',
            isOver && 'bg-primary-50/50 dark:bg-primary-900/10 ring-2 ring-primary-300 dark:ring-primary-700'
          )}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}

          {tasks.length === 0 && (
            <button
              onClick={() => onAddTask(status)}
              className="w-full flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all group"
            >
              <Plus className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-primary-400 transition-colors mb-1" />
              <p className="text-xs text-slate-400 dark:text-slate-600 group-hover:text-primary-500 transition-colors">
                Add task
              </p>
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
