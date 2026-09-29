import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ListPlus,
  Sparkles
} from 'lucide-react';
import { momService } from '../services/momService';
import { projectsService } from '../services/projectsService';

export default function CreateMeetingNoteModal({
  isOpen,
  onClose,
  preselectedProjectId = null,
  onSuccess,
  onToast
}) {
  const myProjects = projectsService.getMyProjects();

  const [projectId, setProjectId] = useState(preselectedProjectId || myProjects[0]?.id || 'PROJ-MAD-2025');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM - 11:00 AM');
  const [organizer, setOrganizer] = useState('Aarav Patel (Intern)');
  const [attendees, setAttendees] = useState(4);
  const [summary, setSummary] = useState('');

  // Decisions
  const [decisions, setDecisions] = useState([]);
  const [newDecision, setNewDecision] = useState('');

  // Action Items
  const [actionItems, setActionItems] = useState([]);
  const [itemText, setItemText] = useState('');
  const [itemAssignee, setItemAssignee] = useState('Aarav Patel');
  const [itemDue, setItemDue] = useState('Dec 22');

  useEffect(() => {
    if (preselectedProjectId) {
      setProjectId(preselectedProjectId);
    } else if (myProjects.length > 0 && !projectId) {
      setProjectId(myProjects[0].id);
    }
  }, [preselectedProjectId, isOpen]);

  if (!isOpen) return null;

  const handleAddDecision = () => {
    if (!newDecision.trim()) return;
    setDecisions([...decisions, newDecision.trim()]);
    setNewDecision('');
  };

  const handleRemoveDecision = (index) => {
    setDecisions(decisions.filter((_, i) => i !== index));
  };

  const handleAddActionItem = () => {
    if (!itemText.trim()) return;
    setActionItems([
      ...actionItems,
      {
        text: itemText.trim(),
        assignee: itemAssignee.trim() || 'Aarav Patel',
        due: itemDue.trim() || 'Next Sprint',
        status: 'Pending'
      }
    ]);
    setItemText('');
  };

  const handleRemoveActionItem = (index) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      onToast?.('Please enter a meeting title');
      return;
    }

    const selectedProj = myProjects.find((p) => p.id === projectId) || {
      id: projectId,
      code: 'PROJ',
      name: 'Project Workspace'
    };

    // Format date string nicely e.g. "Dec 20, 2025"
    let formattedDate = date;
    try {
      const d = new Date(date);
      formattedDate = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (err) {
      // keep date string as is
    }

    const created = momService.addMeetingNote({
      projectId: selectedProj.id,
      projectCode: selectedProj.code,
      projectName: selectedProj.name,
      title,
      date: formattedDate,
      time,
      organizer,
      summary,
      decisions,
      actionItems,
      attendees
    });

    onToast?.(`Published Meeting Note: "${created.title}" for ${selectedProj.name}`);
    onSuccess?.(created);
    onClose();

    // Reset fields
    setTitle('');
    setSummary('');
    setDecisions([]);
    setActionItems([]);
  };

  const isProjectLocked = Boolean(preselectedProjectId);
  const currentProjectName = myProjects.find((p) => p.id === projectId)?.name || 'Project';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Add Meeting Note ({currentProjectName})
              </h3>
              <p className="text-[11px] text-slate-500">
                Record meeting minutes, key decisions, and action items for this project
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Project Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Project <span className="text-rose-500">*</span>
            </label>
            {isProjectLocked ? (
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-semibold flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-purple-600" />
                <span>{currentProjectName}</span>
                <span className="text-[10px] text-purple-600 font-mono">({projectId})</span>
              </div>
            ) : (
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium text-slate-800"
              >
                {myProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Meeting Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Meeting Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint 05 Sync & Biometric Security Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800 font-semibold"
            />
          </div>

          {/* Date, Time, Attendees Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time Window
              </label>
              <input
                type="text"
                placeholder="10:00 AM - 11:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attendees Count
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Organizer / Host
            </label>
            <input
              type="text"
              placeholder="e.g. Aarav Patel (Intern) or Rohan Singh (Tech Lead)"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800"
            />
          </div>

          {/* Meeting Summary */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Meeting Summary & Discussion Points
            </label>
            <textarea
              rows={3}
              placeholder="Summarize key discussions, agenda items, and engineering updates..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800"
            />
          </div>

          {/* Key Decisions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Key Decisions & Agreements
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a key decision and click Add..."
                value={newDecision}
                onChange={(e) => setNewDecision(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDecision();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
              />
              <button
                type="button"
                onClick={handleAddDecision}
                className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {decisions.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {decisions.map((dec, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-purple-50/70 border border-purple-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{dec}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDecision(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Items */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Assigned Action Items
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Action item task description..."
                value={itemText}
                onChange={(e) => setItemText(e.target.value)}
                className="sm:col-span-6 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
              />
              <input
                type="text"
                placeholder="Assignee (e.g. Aarav Patel)"
                value={itemAssignee}
                onChange={(e) => setItemAssignee(e.target.value)}
                className="sm:col-span-3 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
              />
              <div className="sm:col-span-3 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Due (Dec 24)"
                  value={itemDue}
                  onChange={(e) => setItemDue(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddActionItem}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {actionItems.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{item.text}</span>
                      <span className="text-[10px] text-slate-500 ml-2">
                        Assignee: <strong>{item.assignee}</strong> • Due: {item.due}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveActionItem(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Publish Meeting Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

