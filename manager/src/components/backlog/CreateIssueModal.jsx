import React, { useState } from 'react';
import { X, Bookmark, CheckSquare, AlertCircle, Layers } from 'lucide-react';
import { MOCK_ASSIGNEES } from '../../constants/kanban';

export default function CreateIssueModal({
  isOpen,
  onClose,
  epics = [],
  sprints = [],
  initialSprintId = 'sprint-04',
  initialEpicId = '',
  onCreateIssue,
  onCreateEpic,
}) {
  const [issueType, setIssueType] = useState('Story'); // 'Epic' | 'Story' | 'Task' | 'Bug'
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [epicId, setEpicId] = useState(initialEpicId || (epics[0]?.id || ''));
  const [sprintId, setSprintId] = useState(initialSprintId || 'sprint-04');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [storyPoints, setStoryPoints] = useState(3);
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!summary.trim()) return;

    if (issueType === 'Epic') {
      const newEpic = {
        id: `EPIC-${100 + epics.length + 1}`,
        name: summary.trim(),
        description: description.trim(),
        color: '#7C3AED',
        lead: assigneeId ? MOCK_ASSIGNEES.find(u => u.id === assigneeId)?.name : 'Priya Sharma',
        status: 'To Do',
        progress: 0,
      };
      onCreateEpic?.(newEpic);
    } else {
      const assignedUser = MOCK_ASSIGNEES.find(u => u.id === assigneeId) || null;
      const newIssue = {
        id: `SPS-${210 + Math.floor(Math.random() * 800)}`,
        type: issueType,
        title: summary.trim(),
        description: description.trim(),
        epicId: epicId || null,
        sprintId: sprintId || 'backlog',
        assignee: assignedUser,
        priority: priority,
        status: 'TO DO',
        storyPoints: Number(storyPoints) || 0,
        dueDate: dueDate.trim() || 'Dec 24',
        subtasks: [],
      };
      onCreateIssue?.(newIssue);
    }

    // Reset and close
    setSummary('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Create Issue
            </h3>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-medium">Student Management System</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Issue Type Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Issue Type</label>
            <div className="flex items-center gap-1.5">
              {[
                { type: 'Story', icon: Bookmark, color: 'text-emerald-600' },
                { type: 'Task', icon: CheckSquare, color: 'text-blue-600' },
                { type: 'Bug', icon: AlertCircle, color: 'text-rose-600' },
                { type: 'Epic', icon: Layers, color: 'text-purple-600' },
              ].map(({ type, icon: Icon, color }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIssueType(type)}
                  className={`px-2.5 py-1.5 rounded border flex items-center gap-1.5 transition-colors ${
                    issueType === type
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary / Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-900 text-xs font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or context..."
              className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-900 text-xs resize-none"
            />
          </div>

          {issueType !== 'Epic' && (
            <div className="grid grid-cols-2 gap-3">
              {/* Epic Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Epic</label>
                <select
                  value={epicId}
                  onChange={(e) => setEpicId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-600"
                >
                  <option value="">None</option>
                  {epics.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              {/* Sprint Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sprint</label>
                <select
                  value={sprintId}
                  onChange={(e) => setSprintId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-600"
                >
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-600"
              >
                <option value="">Unassigned</option>
                {MOCK_ASSIGNEES.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-600"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {issueType !== 'Epic' && (
            <div className="grid grid-cols-2 gap-3">
              {/* Story Points */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Story Points</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Dec 24"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

