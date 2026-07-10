/**
 * Format a date to a readable string (e.g., "Jan 15, 2025")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date to show relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate: string, taskStatus: string): boolean => {
  if (taskStatus === 'done') return false;
  const due = new Date(dueDate);
  const now = new Date();
  return due < now;
};

/**
 * Check if a date is due today
 */
export const isDueToday = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const today = new Date();
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
};

/**
 * Check if a date is due tomorrow
 */
export const isDueTomorrow = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    due.getFullYear() === tomorrow.getFullYear() &&
    due.getMonth() === tomorrow.getMonth() &&
    due.getDate() === tomorrow.getDate()
  );
};

/**
 * Get days until due date
 */
export const daysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
};

/**
 * Format days until due into a readable string
 */
export const formatDaysUntilDue = (dueDate: string, taskStatus: string): string => {
  if (taskStatus === 'done') return 'Done';
  
  const days = daysUntilDue(dueDate);
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
};
