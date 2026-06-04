import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { COLUMN_CONFIG } from '../../utils/helpers';
import { TaskCard } from '../Task/TaskCard';
import type { Task, TaskStatus } from '../../types';
import { InboxIcon } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn = ({ status, tasks, onTaskClick }: Props) => {
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
        <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20', config.color)}>
          {tasks.length}
        </span>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <InboxIcon className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-600">Drop tasks here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
