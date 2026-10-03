import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, CheckCircle2, UserCheck } from 'lucide-react';

export default function BroadcastAlert({ 
  onSendAlert, 
  onPreview,
  users = [],
  stats
}) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceMode, setAudienceMode] = useState('INTERNS'); // 'INTERNS' | 'ALL' | 'CUSTOM'
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [isSending, setIsSending] = useState(false);

  // Identify interns within the organization
  const internUsers = users.filter((u) => {
    const type = (u.type || u.role || '').toUpperCase();
    return type === 'INTERN' || type.includes('INTERN');
  });

  // Effective target list when "All Interns" is selected
  const defaultTargetUsers = internUsers.length > 0 ? internUsers : users;

  // Sync selected IDs whenever users or audienceMode changes
  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) {
      setSelectedIds(new Set());
      return;
    }

    if (audienceMode === 'INTERNS') {
      setSelectedIds(new Set(defaultTargetUsers.map((u) => u.id)));
    } else if (audienceMode === 'ALL') {
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  }, [users, audienceMode]);

  const handleSelectAudience = (mode) => {
    setAudienceMode(mode);
    if (mode === 'INTERNS') {
      setSelectedIds(new Set(defaultTargetUsers.map((u) => u.id)));
    } else if (mode === 'ALL') {
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.user_code && u.user_code.toLowerCase().includes(q))
    );
  });

  const handleToggle = (id) => {
    setAudienceMode('CUSTOM');
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedIds.size === users.length) {
      setAudienceMode('CUSTOM');
      setSelectedIds(new Set());
    } else {
      setAudienceMode('ALL');
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim() || selectedIds.size === 0 || isSending) return;
    setIsSending(true);
    try {
      await onSendAlert?.(
        {
          title: title.trim() || 'Broadcast Announcement',
          message: message.trim(),
        },
        Array.from(selectedIds)
      );
      setMessage('');
      setTitle('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Broadcast Alert
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Send notifications to organization interns & members
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 border border-purple-200 px-2 py-0.5 rounded-full">
          Organization Communications
        </span>
      </div>

      {/* Target Audience Quick Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-200/70 border border-slate-200 mb-3">
        <button
          type="button"
          onClick={() => handleSelectAudience('INTERNS')}
          className={`py-1 px-2 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            audienceMode === 'INTERNS'
              ? 'bg-white text-purple-800 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>All Interns ({defaultTargetUsers.length})</span>
        </button>
        <button
          type="button"
          onClick={() => handleSelectAudience('ALL')}
          className={`py-1 px-2 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            audienceMode === 'ALL'
              ? 'bg-white text-purple-800 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Members ({users.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setAudienceMode('CUSTOM')}
          className={`py-1 px-2 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            audienceMode === 'CUSTOM'
              ? 'bg-white text-purple-800 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Custom ({selectedIds.size})</span>
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg bg-white border border-slate-200/80 py-2 px-1 mb-3 text-center">
        <div className="flex items-center justify-center gap-1.5 px-2">
          <span className="text-xs font-bold text-slate-800">{users.length}</span>
          <span className="text-[11px] font-medium text-slate-500">Members</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 px-2">
          <span className="text-xs font-bold text-indigo-600">{defaultTargetUsers.length}</span>
          <span className="text-[11px] font-medium text-slate-500">Interns</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 px-2">
          <span className="text-xs font-bold text-purple-700">{selectedIds.size}</span>
          <span className="text-[11px] font-medium text-slate-500">Targeted</span>
        </div>
      </div>

      {/* Recipients Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Selected Recipients
            </span>
            <span className="text-[10px] text-purple-600 font-bold">
              ({selectedIds.size} will receive alert)
            </span>
          </div>
          {users.length > 0 && (
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
            >
              {selectedIds.size === users.length ? 'Clear Selection' : 'Select All Members'}
            </button>
          )}
        </div>

        {/* Filter input */}
        {users.length > 4 && (
          <div className="mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter recipients by name, code or email..."
              className="w-full px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        )}

        {/* Scrollable recipient list */}
        {users.length === 0 ? (
          <div className="p-6 text-center rounded-lg border border-slate-200/90 bg-white text-slate-400 space-y-1">
            <Users className="w-5 h-5 mx-auto text-slate-300" />
            <p className="text-xs font-medium text-slate-600">No Organization Members Found</p>
            <p className="text-[11px] text-slate-400">
              Provision interns or employees to send broadcast alerts.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-4 text-center rounded-lg border border-slate-200/90 bg-white text-slate-400">
            <p className="text-xs font-medium text-slate-500">No members match "{searchQuery}"</p>
          </div>
        ) : (
          <div className="max-h-44 overflow-y-auto rounded-lg border border-slate-200/90 divide-y divide-slate-100 bg-white">
            {filteredUsers.map((user) => {
              const isSelected = selectedIds.has(user.id);
              const isIntern = (user.type || user.role || '').toUpperCase().includes('INTERN');

              return (
                <div
                  key={user.id}
                  onClick={() => handleToggle(user.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer select-none ${
                    isSelected ? 'bg-purple-50/30' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(user.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                  />

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    isIntern ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                    <span className="font-semibold text-slate-900 truncate">
                      {user.name || 'Member'}
                    </span>
                    <span className="text-slate-300 shrink-0">·</span>
                    <span className={`text-[10px] font-mono px-1 rounded shrink-0 font-medium ${
                      isIntern ? 'bg-purple-50 text-purple-700 border border-purple-200/60' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.user_code || user.type || 'MEMBER'}
                    </span>
                    <span className="text-slate-300 shrink-0">·</span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {user.email}
                    </span>
                  </div>

                  {isIntern && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 bg-purple-50 text-purple-700 border border-purple-200">
                      Intern
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message input area */}
      <form onSubmit={handleSend} className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Alert Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Important Notice: Daily Standup Rescheduled"
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Alert Message
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your announcement or alert message for the interns..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500 font-medium">
            Will dispatch in-app alert to <strong className="text-purple-700 font-bold">{selectedIds.size}</strong> recipient{selectedIds.size === 1 ? '' : 's'}.
          </span>
          <div className="flex items-center gap-2">
            {onPreview && (
              <button
                type="button"
                onClick={onPreview}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Preview
              </button>
            )}
            <button
              type="submit"
              disabled={!message.trim() || selectedIds.size === 0 || isSending}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>{isSending ? 'Sending...' : 'Send Alert'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
