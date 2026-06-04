export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  labels: Label[];
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  subtasks: Subtask[];
  comments: Comment[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
  taskCount: number;
}

export interface FilterState {
  priority: Priority | 'all';
  assignee: string | 'all';
  label: string | 'all';
  search: string;
}
