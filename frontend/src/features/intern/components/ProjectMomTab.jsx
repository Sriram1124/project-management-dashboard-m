import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  X, 
  FileText, 
  Tag, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { momService } from '../services/momService';

export default function ProjectMomTab({ 
  projectId = 'PROJ-SMS-2025', 
  projectCode = 'SMS-2025', 
  projectName = 'Student Management System',
  onToast 
}) {
  const [moms, setMoms] = useState(momService.getMoMsByProject(projectId));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMomId, setExpandedMomId] = useState(null);

  // New MoM Form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Sprint Planning');
  const [newDate, setNewDate] = useState('19 Dec 2025');
  const [newTime, setNewTime] = useState('11:00 AM – 12:00 PM');
  const [newOrganizer, setNewOrganizer] = useState('Priya Sharma (Tech Lead)');
  const [newAttendees, setNewAttendees] = useState('12 Participants (Sections A1, B2)');
  const [newAgenda, setNewAgenda] = useState('');
  const [newDecisions, setNewDecisions] = useState('');

  useEffect(() => {
    const unsub = momService.subscribe(() => {
      setMoms(momService.getMoMsByProject(projectId));
    });
    return () => unsub();
  }, [projectId]);

  const meetingTypes = ['All', 'Sprint Planning', 'Architecture Review', 'Retrospective', 'Kickoff'];

  const filteredMoMs = moms.filter((mom) => {
    const matchesSearch = 
      mom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mom.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mom.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mom.keyDecisions.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'All' || mom.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateMoM = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const decisionsArray = newDecisions
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    const typeColorMap = {
      'Sprint Planning': 'bg-purple-50 text-purple-700 border-purple-200',
      'Architecture Review': 'bg-blue-50 text-blue-700 border-blue-200',
      'Retrospective': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Kickoff': 'bg-amber-50 text-amber-700 border-amber-200',
      'Daily Standup': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };

    momService.addMoM({
      projectId,
      projectCode,
      projectName,
      title: newTitle,
      date: newDate,
      time: newTime,
      type: newType,
      typeColor: typeColorMap[newType] || 'bg-slate-50 text-slate-700 border-slate-200',
      organizer: newOrganizer,
      attendees: newAttendees,
      agenda: newAgenda || 'No agenda specified.',
      keyDecisions: decisionsArray.length > 0 ? decisionsArray : ['Action items logged into sprint workspace.']
    });

    setIsModalOpen(false);
    onToast?.(`Published Minutes of Meeting: "${newTitle}"`);

    // Reset form
    setNewTitle('');
    setNewAgenda('');
    setNewDecisions('');
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Search, Type Filters, and Publish MoM Button */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings, decisions, organizers..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {meetingTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-purple-100 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish MoM</span>
        </button>
      </div>

      {/* MoM Records List - Exact Match to Manager ProjectMoMTab */}
      <div className="space-y-3">
        {filteredMoMs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700">No Minutes of Meeting found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No meeting notes match your search or filter criteria for {projectName}. Try clearing filters or publish a new MoM.
            </p>
          </div>
        ) : (
          filteredMoMs.map((mom) => {
            const isExpanded = expandedMomId === mom.id;
            return (
              <div
                key={mom.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {mom.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${mom.typeColor}`}>
                        {mom.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {mom.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {mom.date}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {mom.time}
                    </span>
                  </div>
                </div>

                {/* Metadata & Agenda */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Organizer:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{mom.organizer}</p>

                    <span className="text-slate-400 font-medium text-[11px] block mt-2">Attendees:</span>
                    <p className="text-slate-700 mt-0.5">{mom.attendees}</p>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-400 font-medium text-[11px] block">Meeting Agenda & Context:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">
                      {mom.agenda}
                    </p>
                  </div>
                </div>

                {/* Key Decisions & Action Items */}
                <div className="mt-3.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Key Decisions & Agreed Action Items ({mom.keyDecisions.length})
                    </span>
                    <button
                      onClick={() => setExpandedMomId(isExpanded ? null : mom.id)}
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <ul className="space-y-1.5 text-xs">
                    {(isExpanded ? mom.keyDecisions : mom.keyDecisions.slice(0, 2)).map((dec, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{dec}</span>
                      </li>
                    ))}
                  </ul>

                  {!isExpanded && mom.keyDecisions.length > 2 && (
                    <button
                      onClick={() => setExpandedMomId(mom.id)}
                      className="text-[11px] text-slate-400 hover:text-purple-600 mt-1 font-medium cursor-pointer"
                    >
                      +{mom.keyDecisions.length - 2} more action items
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Publish MoM Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Publish Minutes of Meeting (MoM)</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMoM} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint 05 Architecture & Blocker Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Sprint Planning">Sprint Planning</option>
                    <option value="Architecture Review">Architecture Review</option>
                    <option value="Retrospective">Retrospective</option>
                    <option value="Kickoff">Kickoff</option>
                    <option value="Daily Standup">Daily Standup</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                  <input
                    type="text"
                    value={`${newDate} · ${newTime}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('·');
                      setNewDate(parts[0]?.trim() || newDate);
                      if (parts[1]) setNewTime(parts[1]?.trim());
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organizer</label>
                  <input
                    type="text"
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attendees</label>
                  <input
                    type="text"
                    value={newAttendees}
                    onChange={(e) => setNewAttendees(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agenda / Summary</label>
                <textarea
                  rows={2}
                  placeholder="Key topics discussed, goals of the meeting, context..."
                  value={newAgenda}
                  onChange={(e) => setNewAgenda(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Key Decisions & Action Items (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="• Adopt HttpOnly cookies for JWT&#10;• Rohan to complete Google OAuth by Dec 22&#10;• Merge PR #142"
                  value={newDecisions}
                  onChange={(e) => setNewDecisions(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs transition-colors"
                >
                  Publish MoM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
