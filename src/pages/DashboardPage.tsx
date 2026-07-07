import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useProjectStats } from '../hooks/useTasks';
import { LayoutGrid, CheckCircle2, Clock, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { useState } from 'react';
import { NewProjectModal } from '../components/UI/NewProjectModal';
import type { Project } from '../types';

const ProjectCard = ({ project }: { project: Project }) => {
  const stats = useProjectStats(project.id);
  const navigate = useNavigate();
  const { setActiveProject } = useAppStore();

  return (
    <div
      onClick={() => { setActiveProject(project.id); navigate(`/project/${project.id}`); }}
      className="card p-5 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-md group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: project.color + '20' }}
          >
            {project.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-[180px]">
              {project.description}
            </p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {stats.completion}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${stats.completion}%`, backgroundColor: project.color }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-slate-400">Total</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald-600">{stats.done}</p>
          <p className="text-xs text-slate-400">Done</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-amber-600">{stats.inProgress}</p>
          <p className="text-xs text-slate-400">Active</p>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { projects, tasks } = useAppStore();
  const [showNewProject, setShowNewProject] = useState(false);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
  ).length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of all your projects
          </p>
        </div>
        <button onClick={() => setShowNewProject(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          New project
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total tasks', value: totalTasks, icon: LayoutGrid, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/30' },
          { label: 'Completed', value: doneTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
          { label: 'In progress', value: inProgressTasks, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
          { label: 'Overdue', value: overdueTasks, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/30' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Projects grid */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Projects</h2>
            <span className="text-xs text-slate-400">{projects.length} projects</span>
          </div>
          {projects.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <LayoutGrid className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No projects yet</p>
              <button
                onClick={() => setShowNewProject(true)}
                className="mt-3 btn-primary mx-auto"
              >
                <Plus className="w-4 h-4" /> Create first project
              </button>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent activity</h2>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div key={task.id} className="card p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none mt-0.5">{project?.icon ?? '📋'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            task.status === 'done'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : task.status === 'in-progress'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              : task.status === 'review'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {task.status}   
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
    </div>
  );
};
