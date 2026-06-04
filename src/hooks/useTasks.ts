import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Task, TaskStatus } from '../types';

export const useFilteredTasks = (projectId: string): Record<TaskStatus, Task[]> => {
  const { tasks, filters } = useAppStore();

  return useMemo(() => {
    let filtered = tasks.filter((t) => t.projectId === projectId);

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    if (filters.assignee !== 'all') {
      filtered = filtered.filter((t) => t.assignee === filters.assignee);
    }

    if (filters.label !== 'all') {
      filtered = filtered.filter((t) => t.labels.some((l) => l.id === filters.label));
    }

    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      'in-progress': [],
      review: [],
      done: [],
    };

    filtered.forEach((task) => {
      grouped[task.status].push(task);
    });

    return grouped;
  }, [tasks, projectId, filters]);
};

export const useProjectStats = (projectId: string) => {
  const tasks = useAppStore((s) => s.tasks);

  return useMemo(() => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const total = projectTasks.length;
    const done = projectTasks.filter((t) => t.status === 'done').length;
    const inProgress = projectTasks.filter((t) => t.status === 'in-progress').length;
    const overdue = projectTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;
    const completion = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, done, inProgress, overdue, completion };
  }, [tasks, projectId]);
};
