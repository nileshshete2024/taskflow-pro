import type { Task, Project } from '../types';

export const exportTasksToJSON = (tasks: Task[], projects: Project[]) => {
  const data = {
    exportedAt: new Date().toISOString(),
    tasks,
    projects,
    summary: {
      totalTasks: tasks.length,
      totalProjects: projects.length,
      completedTasks: tasks.filter((t) => t.status === 'done').length,
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportTasksToCSV = (tasks: Task[]) => {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Assignee', 'Due Date', 'Created At'];
  const rows = tasks.map((task) => [
    task.id,
    `"${task.title.replace(/"/g, '""')}"`,
    `"${task.description.replace(/"/g, '""')}"`,
    task.status,
    task.priority,
    task.assignee || '',
    task.dueDate || '',
    task.createdAt,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-tasks-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importTasksFromJSON = (file: File): Promise<{ tasks: Task[]; projects: Project[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve({ tasks: data.tasks || [], projects: data.projects || [] });
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
