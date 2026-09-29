import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';

const INITIAL_PENDING_INTERNS = [
  {
    id: 'pi-1',
    name: 'Arjun Mehta',
    section: 'Section A1',
    missingTask: 'Project Report',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-2',
    name: 'Rohan Shah',
    section: 'Section A1',
    missingTask: 'Weekly Timesheet',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-3',
    name: 'Priya Verma',
    section: 'Section B2',
    missingTask: 'Sprint Update',
    status: 'Overdue',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-4',
    name: 'Vikram Malhotra',
    section: 'Section A2',
    missingTask: 'Weekly Feedback Survey',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-5',
    name: 'Ananya Iyer',
    section: 'Section B1',
    missingTask: 'Code Review Sign-off',
    status: 'Overdue',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-6',
    name: 'Dev Patel',
    section: 'Section C1',
    missingTask: 'Sprint Retrospective Form',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-7',
    name: 'Sneha Kulkarni',
    section: 'Section C2',
    missingTask: 'Timesheet Hours (Week 4)',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-8',
    name: 'Kabir Das',
    section: 'Section D1',
    missingTask: 'Environment Verification',
    status: 'Overdue',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-9',
    name: 'Meera Nair',
    section: 'Section D2',
    missingTask: 'Sprint 05 Goal Review',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-10',
    name: 'Aditya Joshi',
    section: 'Section A1',
    missingTask: 'Sprint Backlog Update',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'pi-11',
    name: 'Ishaan Gupta',
    section: 'Section B2',
    missingTask: 'Mentor 1:1 Sign-off',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
  },
];

export default function BroadcastAlert({ 
  onSendAlert, 
  onPreview,
  stats = { pending: 8, overdue: 3, recipients: 11 } 
}) {
  const [message, setMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(INITIAL_PENDING_INTERNS.map((i) => i.id))
  );

  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedIds.size === INITIAL_PENDING_INTERNS.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(INITIAL_PENDING_INTERNS.map((i) => i.id)));
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!message.trim() || selectedIds.size === 0) return;
    onSendAlert?.(message, Array.from(selectedIds));
    setMessage('');
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
      {/* Header with notification/bell icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Broadcast Alert
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Admin Action Panel
        </span>
      </div>

      {/* Three separate compact statistics: 8 Pending, 3 Overdue, 11 Recipients */}
      <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg bg-white border border-slate-200/80 py-2 px-1 mb-3 text-center">
        <div className="flex items-center justify-center gap-1.5 px-2">
          <span className="text-xs font-bold text-amber-700">{stats.pending}</span>
          <span className="text-[11px] font-medium text-slate-500">Pending</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 px-2">
          <span className="text-xs font-bold text-rose-600">{stats.overdue}</span>
          <span className="text-[11px] font-medium text-slate-500">Overdue</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 px-2">
          <span className="text-xs font-bold text-purple-700">{selectedIds.size}</span>
          <span className="text-[11px] font-medium text-slate-500">Recipients</span>
        </div>
      </div>

      {/* Pending Submissions Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Pending Submissions
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ({selectedIds.size} of {INITIAL_PENDING_INTERNS.length} selected)
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleAll}
            className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
          >
            {selectedIds.size === INITIAL_PENDING_INTERNS.length ? 'Clear All' : 'Select All'}
          </button>
        </div>

        {/* Compact scrollable list */}
        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200/90 divide-y divide-slate-100 bg-white">
          {INITIAL_PENDING_INTERNS.map((intern) => {
            const isSelected = selectedIds.has(intern.id);
            const isOverdue = intern.status === 'Overdue';

            return (
              <div
                key={intern.id}
                onClick={() => handleToggle(intern.id)}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer select-none ${
                  isSelected ? 'bg-purple-50/20' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(intern.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                />

                <img
                  src={intern.avatar}
                  alt={intern.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                />

                <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                  <span className="font-semibold text-slate-900 truncate">
                    {intern.name}
                  </span>
                  <span className="text-slate-300 shrink-0">·</span>
                  <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                    {intern.section}
                  </span>
                  <span className="text-slate-300 shrink-0">·</span>
                  <span className="text-[11px] text-slate-600 truncate">
                    {intern.missingTask}
                  </span>
                </div>

                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                    isOverdue
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {intern.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-width Message input area */}
      <form onSubmit={handleSend} className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Message
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter an alert message..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors"
          />
        </div>

        {/* Action Buttons: Preview (secondary) and Send Alert (primary) aligned bottom-right */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onPreview}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={!message.trim() || selectedIds.size === 0}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Send Alert</span>
          </button>
        </div>
      </form>
    </div>
  );
}
