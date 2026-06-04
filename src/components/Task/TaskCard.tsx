import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MessageSquare, CheckSquare, User } from 'lucide-react';
import { PRIORITY_CONFIG, formatDate, isOverdue } from '../../utils/helpers';
import type { Task } from '../../types';
import clsx from 'clsx';

interface Props {
  task: Task;
  onTaskClick: (task: Task) => void;
  isDragging?: boolean;
}

const PRIORITY_DOT: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-blue-500',
  low: 'bg-slate-400',
};

export const TaskCard = ({ task, onTaskClick, isDragging = false }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onTaskClick(task)}
      className={clsx(
        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 cursor-pointer select-none',
        'hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all',
        (isDragging || isSortDragging) && 'opacity-50 border-primary-400 shadow-lg'
      )}
    >
      {/* Priority indicator & labels */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', PRIORITY_DOT[task.priority])} />
          {task.labels.slice(0, 2).map((label) => (
            <span
              key={label.id}
              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: label.color + '20', color: label.color }}
            >
              {label.name}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="text-xs text-slate-400">+{task.labels.length - 2}</span>
          )}
        </div>
        <span className={clsx('text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0', priorityConfig.bg, priorityConfig.color)}>
          {priorityConfig.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug mb-2.5 line-clamp-2">
        {task.title}
      </h3>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {completedSubtasks}/{task.subtasks.length}
            </span>
          )}
          {/* Comments */}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Due date */}
          {task.dueDate && (
            <span className={clsx('flex items-center gap-1 text-xs', overdue ? 'text-red-500 font-medium' : 'text-slate-400')}>
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
          {/* Assignee avatar */}
          {task.assignee && (
            <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center" title={task.assignee}>
              <User className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            </div>
          )}
        </div>
      </div>

      {/* Subtask progress bar */}
      {task.subtasks.length > 0 && (
        <div className="mt-2.5 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all"
            style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
