import type { Task, Project } from '../types';
import { validateImportedData, ImportError, Result } from './validation';

/**
 * Exports tasks and projects as a JSON backup file
 */
export const exportTasksToJSON = (tasks: Task[], projects: Project[]): void => {
  try {
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
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export to JSON failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to export data as JSON');
  }
};

/**
 * Exports tasks as CSV for spreadsheet applications
 */
export const exportTasksToCSV = (tasks: Task[]): void => {
  try {
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
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `taskflow-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export to CSV failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to export tasks as CSV');
  }
};

/**
 * Imports tasks and projects from a JSON file with validation
 */
export const importTasksFromJSON = (
  file: File
): Promise<Result<{ tasks: Task[]; projects: Project[] }, ImportError>> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          
          if (typeof result !== 'string') {
            resolve({
              success: false,
              error: new ImportError('Invalid file content', 'file'),
            });
            return;
          }

          const data = JSON.parse(result);
          
          // Validate imported data structure
          const validationErrors = validateImportedData(data);
          if (validationErrors.length > 0) {
            resolve({
              success: false,
              error: new ImportError(
                `Invalid data structure: ${validationErrors.map((e) => e.message).join(', ')}`,
                'schema'
              ),
            });
            return;
          }

          resolve({
            success: true,
            data: {
              tasks: Array.isArray(data.tasks) ? data.tasks : [],
              projects: Array.isArray(data.projects) ? data.projects : [],
            },
          });
        } catch (parseError) {
          resolve({
            success: false,
            error: new ImportError(
              parseError instanceof Error ? parseError.message : 'Invalid JSON format',
              'parse'
            ),
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: new ImportError('Failed to read file', 'file'),
        });
      };

      reader.readAsText(file);
    } catch (error) {
      resolve({
        success: false,
        error: new ImportError(
          error instanceof Error ? error.message : 'Unknown error during import',
          'unknown'
        ),
      });
    }
  });
};
