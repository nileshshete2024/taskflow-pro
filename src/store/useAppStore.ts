import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Project, TaskStatus, FilterState, Label } from '../types';
import { generateId } from '../utils/helpers';
import { SAMPLE_PROJECTS, SAMPLE_TASKS } from '../utils/sampleData';

interface AppState {
  tasks: Task[];
  projects: Project[];
  activeProjectId: string | null;
  filters: FilterState;
  darkMode: boolean;

  // Project actions
  setActiveProject: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'taskCount'>) => void;
  deleteProject: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderTasks: (activeId: string, overId: string, status: TaskStatus) => void;

  // Subtask actions
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Comment actions
  addComment: (taskId: string, content: string, author: string) => void;

  // Label actions
  addLabelToTask: (taskId: string, label: Label) => void;
  removeLabelFromTask: (taskId: string, labelId: string) => void;

  // Filter actions
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;

  // UI actions
  toggleDarkMode: () => void;

  // Data management
  importData: (data: { tasks: Task[]; projects: Project[] }) => void;
  resetData: () => void;
}

const defaultFilters: FilterState = {
  priority: 'all',
  assignee: 'all',
  label: 'all',
  search: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: SAMPLE_TASKS,
      projects: SAMPLE_PROJECTS,
      activeProjectId: SAMPLE_PROJECTS[0]?.id ?? null,
      filters: defaultFilters,
      darkMode: false,

      setActiveProject: (id) => set({ activeProjectId: id, filters: defaultFilters }),

      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: generateId(),
              createdAt: new Date().toISOString(),
              taskCount: 0,
            },
          ],
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
          activeProjectId:
            state.activeProjectId === id
              ? (state.projects.find((p) => p.id !== id)?.id ?? null)
              : state.activeProjectId,
        })),

      addTask: (task) =>
        set((state) => {
          const newTask: Task = {
            ...task,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subtasks: [],
            comments: [],
          };
          return {
            tasks: [...state.tasks, newTask],
            projects: state.projects.map((p) =>
              p.id === task.projectId ? { ...p, taskCount: p.taskCount + 1 } : p
            ),
          };
        }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          return {
            tasks: state.tasks.filter((t) => t.id !== id),
            projects: state.projects.map((p) =>
              p.id === task?.projectId ? { ...p, taskCount: Math.max(0, p.taskCount - 1) } : p
            ),
          };
        }),

      moveTask: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      reorderTasks: (activeId, overId, status) =>
        set((state) => {
          const columnTasks = state.tasks.filter((t) => t.status === status);
          const activeIdx = columnTasks.findIndex((t) => t.id === activeId);
          const overIdx = columnTasks.findIndex((t) => t.id === overId);
          if (activeIdx === -1 || overIdx === -1) return state;


          const reordered = [...columnTasks];
          const [removed] = reordered.splice(activeIdx, 1);
          reordered.splice(overIdx, 0, removed);

          const otherTasks = state.tasks.filter((t) => t.status !== status);
          return { tasks: [...otherTasks, ...reordered] };
        }),

      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: [
                    ...t.subtasks,
                    { id: generateId(), title, completed: false },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),

      addComment: (taskId, content, author) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...t.comments,
                    {
                      id: generateId(),
                      author,
                      content,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),

      addLabelToTask: (taskId, label) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId && !t.labels.find((l) => l.id === label.id)
              ? { ...t, labels: [...t.labels, label], updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      removeLabelFromTask: (taskId, labelId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  labels: t.labels.filter((l) => l.id !== labelId),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),

      setFilter: (filter) =>
        set((state) => ({ filters: { ...state.filters, ...filter } })),

      resetFilters: () => set({ filters: defaultFilters }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      importData: (data) =>
        set({
          tasks: data.tasks || [],
          projects: data.projects || [],
          activeProjectId: data.projects?.[0]?.id ?? null,
          filters: defaultFilters,
        }),

      resetData: () =>
        set({
          tasks: SAMPLE_TASKS,
          projects: SAMPLE_PROJECTS,
          activeProjectId: SAMPLE_PROJECTS[0]?.id ?? null,
          filters: defaultFilters,
          darkMode: false,
        }),
    }),
    {
      name: 'taskflow-storage',
    }
  )
);
