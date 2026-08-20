/**
 * Validation utilities for data integrity and type safety
 */

import type { Task, Project } from '../types';

export const VALID_TASK_STATUSES = ['todo', 'in-progress', 'review', 'done'] as const;
export const VALID_TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export type ValidationError = {
  field: string;
  message: string;
};

export const hasValidationErrors = (errors: ValidationError[]): boolean => errors.length > 0;

export const isValidTaskStatus = (status?: string): boolean =>
  typeof status === 'string' && VALID_TASK_STATUSES.includes(status as (typeof VALID_TASK_STATUSES)[number]);

export const isValidTaskPriority = (priority?: string): boolean =>
  typeof priority === 'string' && VALID_TASK_PRIORITIES.includes(priority as (typeof VALID_TASK_PRIORITIES)[number]);

/**
 * Validates task data before creation or update
 */
export const validateTask = (
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks' | 'comments'>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!task.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (task.title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be 200 characters or less' });
  }

  if (!task.projectId?.trim()) {
    errors.push({ field: 'projectId', message: 'Project ID is required' });
  }

  if (!isValidTaskStatus(task.status)) {
    errors.push({ field: 'status', message: 'Invalid task status' });
  }

  if (!isValidTaskPriority(task.priority)) {
    errors.push({ field: 'priority', message: 'Invalid task priority' });
  }

  if (task.description && task.description.length > 2000) {
    errors.push({ field: 'description', message: 'Description must be 2000 characters or less' });
  }

  if (task.dueDate && isNaN(new Date(task.dueDate).getTime())) {
    errors.push({ field: 'dueDate', message: 'Invalid due date format' });
  }

  return errors;
};

/**
 * Checks whether the provided value is a valid six-character hex color.
 */
export const isValidHexColor = (color?: string): boolean =>
  typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);

/**
 * Validates project data before creation
 */
export const validateProject = (
  project: Omit<Project, 'id' | 'createdAt' | 'taskCount'>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!project.name?.trim()) {
    errors.push({ field: 'name', message: 'Project name is required' });
  } else if (project.name.length > 100) {
    errors.push({ field: 'name', message: 'Project name must be 100 characters or less' });
  }

  if (project.description && project.description.length > 500) {
    errors.push({ field: 'description', message: 'Description must be 500 characters or less' });
  }

  if (!isValidHexColor(project.color)) {
    errors.push({ field: 'color', message: 'Invalid color format (must be hex color)' });
  }

  if (!project.icon || project.icon.length > 3) {
    errors.push({ field: 'icon', message: 'Invalid icon' });
  }

  return errors;
};

/**
 * Validates imported data structure
 */
export const validateImportedData = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: 'Data must be a valid object' });
    return errors;
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.tasks)) {
    errors.push({ field: 'tasks', message: 'Tasks must be an array' });
  }

  if (!Array.isArray(obj.projects)) {
    errors.push({ field: 'projects', message: 'Projects must be an array' });
  }

  return errors;
};

/**
 * Custom error class for import operations
 */
export class ImportError extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ImportError';
  }
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
