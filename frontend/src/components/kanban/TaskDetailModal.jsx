import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  User, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Send, 
  MessageSquare, 
  Lock, 
  Edit2, 
  Save 
} from 'lucide-react';
import { 
  COLUMNS_CONFIG, 
  KANBAN_PRIORITIES, 
  MOCK_ASSIGNEES, 
  MOCK_EPICS 
} from '../../constants/kanban';

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) {
  if (!isOpen || !task) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [assigneeId, setAssigneeId] = useState(task.assignee?.id || '');
  const [epic, setEpic] = useState(task.epic);
  const [storyPoints, setStoryPoints] = useState(task.storyPoints || 3);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState('');

  const toggleSubtask = (stId) => {
    const updated = subtasks.map((st) =>
      st.id === stId ? { ...st, done: !st.done } : st
    );
    setSubtasks(updated);
    onUpdateTask?.({ ...task, subtasks: updated });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added = [
      ...comments,
      {
        id: `c-${Date.now()}`,
        author: 'Sarah Mitchell',
        time: 'Just now',
        text: newComment.trim(),
      },
    ];
    setComments(added);
    setNewComment('');
    onUpdateTask?.({ ...task, comments: added });
  };

  const handleSaveEdits = () => {
    const updatedAssignee = MOCK_ASSIGNEES.find((a) => a.id === assigneeId) || null;
    const updated = {
      ...task,
      title: editedTitle.trim() || task.title,
      description: editedDesc.trim(),
      status,
      priority,
      assignee: updatedAssignee,
      epic,
      storyPoints: Number(storyPoints) || task.storyPoints,
      dueDate: dueDate.trim() || task.dueDate,
      subtasks,
      comments,
    };
    onUpdateTask?.(updated);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              {task.id}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  onUpdateTask?.({ ...task, status: e.target.value });
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
              >
                {COLUMNS_CONFIG.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {priority} Priority
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                isEditing
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Edit Mode"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onDeleteTask?.(task.id);
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Title & Description */}
          <div>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-base font-bold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
                />
                <textarea
                  rows={3}
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  placeholder="Task description..."
                  className="w-full text-xs text-slate-700 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleSaveEdits}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {task.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Assignee
              </span>
              {task.assignee ? (
                <div className="flex items-center gap-1.5">
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-800 truncate">
                    {task.assignee.name}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 font-medium">Unassigned</span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Epic
              </span>
              <span className="font-semibold text-slate-800">{task.epic}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Story Points
              </span>
              <span className="font-semibold text-slate-800">{task.storyPoints} SP</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Due Date
              </span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  task.isOverdue ? 'text-rose-600' : 'text-slate-800'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{task.dueDate}</span>
              </span>
            </div>
          </div>

          {/* Subtasks Checklist */}
          {subtasks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Subtasks Checklist</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {subtasks.filter((s) => s.done).length}/{subtasks.length} Completed
                </span>
              </h4>

              <div className="space-y-2">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(st.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition-colors ${
                      st.done
                        ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-500 line-through'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300'
                    }`}
                  >
                    {st.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span>{st.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity / Comments */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              <span>Activity & Comments ({comments.length})</span>
            </h4>

            {comments.length > 0 && (
              <div className="space-y-2.5 mb-3">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-800">{c.author}</span>
                      <span className="text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-slate-600 leading-normal">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment or progress update..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Time Logged: <strong className="text-slate-800">{task.timeLogged || '0h'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

