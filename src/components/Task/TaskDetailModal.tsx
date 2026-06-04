import { useState, useTransition } from 'react';
import {
  X, Trash2, Calendar, User, Tag, ChevronDown,
  Plus, Check, MessageSquare, Edit3, Save, AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PRIORITY_CONFIG, ASSIGNEES, PRESET_LABELS, formatDate, isOverdue } from '../../utils/helpers';
import type { Task, Priority, TaskStatus } from '../../types';
import clsx from 'clsx';

interface Props {
  task: Task;
  onClose: () => void;
  onTaskUpdate: (task: Task) => void;
}

export const TaskDetailModal = ({ task, onClose, onTaskUpdate }: Props) => {
  const { updateTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask, addComment, addLabelToTask, removeLabelFromTask } =
    useAppStore();
  const [, startTransition] = useTransition();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(task.description);
  const [newSubtask, setNewSubtask] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  // Get fresh task from store
  const freshTask = useAppStore((s) => s.tasks.find((t) => t.id === task.id)) ?? task;

  const handleUpdate = (updates: Partial<Task>) => {
    startTransition(() => {
      updateTask(task.id, updates);
      onTaskUpdate({ ...freshTask, ...updates });
    });
  };

  const handleSaveTitle = () => {
    if (titleDraft.trim()) handleUpdate({ title: titleDraft.trim() });
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    handleUpdate({ description: descDraft.trim() });
    setIsEditingDesc(false);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    addSubtask(task.id, newSubtask.trim());
    setNewSubtask('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText.trim(), 'Nilesh');
    setCommentText('');
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const overdue = isOverdue(freshTask.dueDate) && freshTask.status !== 'done';
  const completedSubtasks = freshTask.subtasks.filter((s) => s.completed).length;
  const priorityConfig = PRIORITY_CONFIG[freshTask.priority];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full sm:rounded-2xl sm:max-w-2xl sm:mx-4 max-h-[90vh] flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={clsx('text-xs font-semibold px-2 py-1 rounded-lg', priorityConfig.bg, priorityConfig.color)}
            >
              {priorityConfig.label}
            </span>
            {overdue && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Overdue
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Title */}
            <div>
              {isEditingTitle ? (
                <div className="flex gap-2">
                  <input
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    className="input flex-1 text-base font-semibold"
                    autoFocus
                  />
                  <button onClick={handleSaveTitle} className="btn-primary px-3">
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="group flex items-start gap-2 w-full text-left"
                >
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug flex-1">
                    {freshTask.title}
                  </h2>
                  <Edit3 className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1 flex-shrink-0" />
                </button>
              )}
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Status */}
              <div className="card p-3">
                <p className="text-xs text-slate-400 mb-1.5">Status</p>
                <select
                  value={freshTask.status}
                  onChange={(e) => handleUpdate({ status: e.target.value as TaskStatus })}
                  className="input py-1 text-xs"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div className="card p-3">
                <p className="text-xs text-slate-400 mb-1.5">Priority</p>
                <select
                  value={freshTask.priority}
                  onChange={(e) => handleUpdate({ priority: e.target.value as Priority })}
                  className="input py-1 text-xs"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Assignee */}
              <div className="card p-3">
                <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                  <User className="w-3 h-3" /> Assignee
                </p>
                <select
                  value={freshTask.assignee ?? ''}
                  onChange={(e) => handleUpdate({ assignee: e.target.value || undefined })}
                  className="input py-1 text-xs"
                >
                  <option value="">Unassigned</option>
                  {ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Due date */}
              <div className="card p-3">
                <p className={clsx('text-xs mb-1.5 flex items-center gap-1', overdue ? 'text-red-500' : 'text-slate-400')}>
                  <Calendar className="w-3 h-3" />
                  {overdue ? 'Overdue!' : 'Due date'}
                </p>
                <input
                  type="date"
                  value={freshTask.dueDate ? freshTask.dueDate.split('T')[0] : ''}
                  onChange={(e) => handleUpdate({ dueDate: e.target.value || undefined })}
                  className={clsx('input py-1 text-xs', overdue && 'border-red-300 dark:border-red-700')}
                />
              </div>
            </div>

            {/* Labels */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Labels
                </p>
                <button
                  onClick={() => setShowLabelPicker((v) => !v)}
                  className="text-xs text-primary-600 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                  <ChevronDown className={clsx('w-3 h-3 transition-transform', showLabelPicker && 'rotate-180')} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {freshTask.labels.map((label) => (
                  <span
                    key={label.id}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: label.color + '20', color: label.color }}
                    onClick={() => removeLabelFromTask(task.id, label.id)}
                    title="Click to remove"
                  >
                    {label.name} ×
                  </span>
                ))}
              </div>
              {showLabelPicker && (
                <div className="mt-2 p-2 card flex flex-wrap gap-1.5 animate-slide-in">
                  {PRESET_LABELS.filter((l) => !freshTask.labels.find((fl) => fl.id === l.id)).map((label) => (
                    <button
                      key={label.id}
                      onClick={() => { addLabelToTask(task.id, label); setShowLabelPicker(false); }}
                      className="text-xs px-2 py-0.5 rounded-full border font-medium hover:opacity-80 transition-opacity"
                      style={{ borderColor: label.color, color: label.color }}
                    >
                      {label.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Description</p>
              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    value={descDraft}
                    onChange={(e) => setDescDraft(e.target.value)}
                    className="input h-28 resize-none text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveDesc} className="btn-primary text-xs py-1.5">
                      <Save className="w-3 h-3" /> Save
                    </button>
                    <button onClick={() => setIsEditingDesc(false)} className="btn-secondary text-xs py-1.5">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="group w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {freshTask.description || (
                      <span className="text-slate-400 italic">Add a description...</span>
                    )}
                  </p>
                </button>
              )}
            </div>

            {/* Subtasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Subtasks ({completedSubtasks}/{freshTask.subtasks.length})
                </p>
                {freshTask.subtasks.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {Math.round((completedSubtasks / freshTask.subtasks.length) * 100)}%
                  </span>
                )}
              </div>

              {freshTask.subtasks.length > 0 && (
                <div className="mb-2 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${(completedSubtasks / freshTask.subtasks.length) * 100}%` }}
                  />
                </div>
              )}

              <div className="space-y-1.5 mb-3">
                {freshTask.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className={clsx(
                        'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                        subtask.completed
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
                      )}
                    >
                      {subtask.completed && <Check className="w-2.5 h-2.5 text-white" />}
                    </button>
                    <span className={clsx('text-sm flex-1', subtask.completed && 'line-through text-slate-400')}>
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(task.id, subtask.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask..."
                  className="input flex-1 text-sm py-1.5"
                />
                <button type="submit" disabled={!newSubtask.trim()} className="btn-primary py-1.5 px-3 disabled:opacity-50">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Comments */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Comments ({freshTask.comments.length})
              </p>

              <div className="space-y-3 mb-3">
                {freshTask.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary-600">
                      {comment.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {comment.author}
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="input flex-1 text-sm py-1.5"
                />
                <button type="submit" disabled={!commentText.trim()} className="btn-primary py-1.5 px-3 disabled:opacity-50">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
