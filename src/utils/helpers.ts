import type { Priority, TaskStatus } from '../types';

export const generateId = (): string =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string; border: string }
> = {
  low: {
    label: 'Low',
    color: 'text-slate-500',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-300',
  },
  high: {
    label: 'High',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-300',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-300',
  },
};

export const COLUMN_CONFIG: Record<
  TaskStatus,
  { title: string; color: string; bg: string; dot: string }
> = {
  todo: {
    title: 'To Do',
    color: 'text-slate-600',
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    dot: 'bg-slate-400',
  },
  'in-progress': {
    title: 'In Progress',
    color: 'text-blue-600',
    bg: 'bg-blue-50/50 dark:bg-blue-900/20',
    dot: 'bg-blue-500',
  },
  review: {
    title: 'In Review',
    color: 'text-amber-600',
    bg: 'bg-amber-50/50 dark:bg-amber-900/20',
    dot: 'bg-amber-500',
  },
  done: {
    title: 'Done',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
    dot: 'bg-emerald-500',
  },
};

export const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

export const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
];

export const PROJECT_ICONS = ['📋', '🚀', '🎯', '💡', '🛠️', '📱', '🌐', '📊'];

export const ASSIGNEES = ['Nilesh', 'Priya', 'Rahul', 'Sneha', 'Amit'];

export const PRESET_LABELS = [
  { id: 'l1', name: 'Bug', color: '#ef4444' },
  { id: 'l2', name: 'Feature', color: '#6366f1' },
  { id: 'l3', name: 'Design', color: '#ec4899' },
  { id: 'l4', name: 'Backend', color: '#f97316' },
  { id: 'l5', name: 'Frontend', color: '#06b6d4' },
  { id: 'l6', name: 'Docs', color: '#22c55e' },
];

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};
