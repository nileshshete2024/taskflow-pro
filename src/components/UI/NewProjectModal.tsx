import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PROJECT_COLORS, PROJECT_ICONS } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

interface Props {
  onClose: () => void;
}


export const NewProjectModal = ({ onClose }: Props) => {
  const { addProject } = useAppStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]!);
  const [icon, setIcon] = useState(PROJECT_ICONS[0]!);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const submitProject = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    addProject({ name: trimmedName, description: description.trim(), color, icon });
    const updatedProjects = useAppStore.getState().projects;
    const latest = updatedProjects[updatedProjects.length - 1];
    if (latest) navigate(`/project/${latest.id}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProject();
  };

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      submitProject();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">New project</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Project name
            </label>
            <div className="flex gap-2">
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="input w-16 text-lg"
              >
                {PROJECT_ICONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My awesome project"
                className="input flex-1"
                autoFocus
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              className="input h-20 resize-none"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: c, outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: color + '20' }}
            >
              {icon}
            </div>
            <div>
              <p className="font-medium text-sm text-slate-900 dark:text-white">
                {name || 'Project name'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {description || 'Project description'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
