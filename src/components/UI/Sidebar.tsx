import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  Moon,
  Sun,
  Zap,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { NewProjectModal } from './NewProjectModal';
import clsx from 'clsx';

export const Sidebar = () => {
  const { projects, darkMode, toggleDarkMode, deleteProject, activeProjectId, setActiveProject } =
    useAppStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const navigate = useNavigate();

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Delete this project and all its tasks?')) {
      deleteProject(id);
      navigate('/dashboard');
    }
  };

  return (
    <>
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white text-base tracking-tight">
              TaskFlow Pro
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1 overflow-y-auto">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>

          {/* Projects section */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Projects
              </span>
              <button
                onClick={() => setShowNewProject(true)}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {projects.map((project) => (
                <NavLink
                  key={project.id}
                  to={`/project/${project.id}`}
                  onClick={() => setActiveProject(project.id)}
                  className={({ isActive }) =>
                    clsx(
                      'group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full',
                      isActive || activeProjectId === project.id
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    )
                  }
                >
                  <span className="text-base leading-none">{project.icon}</span>
                  <span className="flex-1 truncate font-medium">{project.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:hidden">
                    {project.taskCount}
                  </span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="p-0.5 rounded text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                </NavLink>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="px-3 py-4 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-500">No projects yet</p>
                <button
                  onClick={() => setShowNewProject(true)}
                  className="mt-1 text-xs text-primary-600 hover:underline"
                >
                  Create one →
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
    </>
  );
};
