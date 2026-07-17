<<<<<<< HEAD
# TaskFlow Pro 🚀

A modern, full-featured **Kanban task management app** built with React 19, TypeScript, and Tailwind CSS. Think Trello meets Notion — with drag-and-drop, real-time state management, and a clean, professional UI.

![TaskFlow Pro Screenshot](https://img.shields.io/badge/React-19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss) ![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)

## ✨ Features

- **Kanban Board** — 4-column board (To Do → In Progress → Review → Done)
- **Drag & Drop** — Smooth task reordering and cross-column movement with `@dnd-kit`
- **Task Details** — Rich detail view with inline editing, subtasks, comments, labels
- **Smart Filters** — Filter by priority, assignee, label, or search query
- **Dashboard** — Project overview with progress tracking and recent activity
- **Multiple Projects** — Create, manage, and switch between projects
- **Dark Mode** — System-aware dark/light theme toggle
- **Persistent State** — Data saved to localStorage via Zustand persist middleware
- **Responsive UI** — Works on desktop and tablet

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework (`useTransition`, `useOptimistic`) |
| **TypeScript 5.6** | Type safety across all components |
| **Vite 6** | Lightning-fast build tool |
| **Tailwind CSS 3** | Utility-first styling |
| **Zustand 5** | Lightweight global state management |
| **React Router v7** | Client-side routing |
| **@dnd-kit** | Accessible drag-and-drop |
| **Lucide React** | Icon library |
| **date-fns** | Date formatting |

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/taskflow-pro.git
cd taskflow-pro

# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Board/
│   │   ├── KanbanBoard.tsx     # DnD context + board container
│   │   ├── KanbanColumn.tsx    # Droppable column
│   │   └── FilterBar.tsx       # Filter controls
│   ├── Task/
│   │   ├── TaskCard.tsx        # Draggable task card
│   │   ├── TaskDetailModal.tsx # Full task editor
│   │   └── NewTaskModal.tsx    # Create task form
│   └── UI/
│       ├── Sidebar.tsx         # Navigation + project list
│       └── NewProjectModal.tsx # Create project form
├── hooks/
│   └── useTasks.ts             # Custom hooks (filtering, stats)
├── pages/
│   ├── BoardPage.tsx           # Kanban board view
│   └── DashboardPage.tsx       # Overview + stats
├── store/
│   └── useAppStore.ts          # Zustand store (all state + actions)
├── types/
│   └── index.ts                # TypeScript interfaces
└── utils/
    ├── helpers.ts              # Constants + utility functions
    └── sampleData.ts           # Seed data for demo
```

## 🎯 React 19 Features Used

- **`useTransition`** — Non-blocking state updates for task detail edits
- **`useOptimistic`** — Optimistic UI updates on task status changes
- **Strict Mode** — Double-render detection in development

## 🔑 Key Architecture Decisions

- **Zustand with persist** — Chosen over Redux for simplicity; perfect for this scale
- **@dnd-kit over react-beautiful-dnd** — Actively maintained, better accessibility, works with React 18+
- **Component co-location** — Related components grouped by feature, not by type
- **Custom hooks** — Business logic extracted from components (`useFilteredTasks`, `useProjectStats`)

## 📝 License

MIT © Nilesh Shete
=======
# taskflow-pro
TaskFlow Pro — a full-featured Task &amp; Project Management App (think a mini Jira)
>>>>>>> 696ed5a6c71e4756783d87232e92564f7588b0a4

