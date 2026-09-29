import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Tag, 
  ArrowRight,
  ListTodo,
  FolderKanban,
  Plus,
  Filter
} from 'lucide-react';
import { momService } from '../services/momService';
import { projectsService } from '../services/projectsService';
import CreateMeetingNoteModal from './CreateMeetingNoteModal';

export default function InternMomTab({ onToast }) {
  const [publishedMoMs, setPublishedMoMs] = useState(momService.getPublishedMoMs());
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('ALL');
  const [selectedMoM, setSelectedMoM] = useState(null);
  const [isAddMoMOpen, setIsAddMoMOpen] = useState(false);

  const myProjects = projectsService.getMyProjects();

  useEffect(() => {
    const unsub = momService.subscribe((updated) => {
      setPublishedMoMs(updated);
      // Keep selectedMoM valid
      if (selectedMoM) {
        const found = updated.find((m) => m.id === selectedMoM.id);
        setSelectedMoM(found || updated[0] || null);
      } else if (updated.length > 0) {
        setSelectedMoM(updated[0]);
      }
    });
    return () => unsub();
  }, [selectedMoM]);

  // Filter MoMs based on selected project
  const filteredMoMs = publishedMoMs.filter((m) => {
    if (selectedProjectFilter === 'ALL') return true;
    return m.project_id === selectedProjectFilter || m.project?.toLowerCase().includes(selectedProjectFilter.toLowerCase());
  });

  const myActionItems = momService.getActionItemsForUser().filter((a) => {
    if (selectedProjectFilter === 'ALL') return true;
    return a.projectId === selectedProjectFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>Minutes of Meeting (MoM) by Project</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Meeting records, architecture reviews, and assigned action items separated by project
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200">
            {myActionItems.length} Action Items for You
          </span>

          <button
            type="button"
            onClick={() => setIsAddMoMOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Meeting Note</span>
          </button>
        </div>
      </div>

      {/* Project Separation Tabs */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setSelectedProjectFilter('ALL');
            if (publishedMoMs.length > 0) setSelectedMoM(publishedMoMs[0]);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedProjectFilter === 'ALL'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>All Projects</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            selectedProjectFilter === 'ALL' ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {publishedMoMs.length}
          </span>
        </button>

        {myProjects.map((proj) => {
          const count = publishedMoMs.filter(
            (m) => m.project_id === proj.id || m.project?.toLowerCase().includes(proj.name.toLowerCase())
          ).length;
          const isSelected = selectedProjectFilter === proj.id;

          return (
            <button
              key={proj.id}
              type="button"
              onClick={() => {
                setSelectedProjectFilter(proj.id);
                const firstInProject = publishedMoMs.find(
                  (m) => m.project_id === proj.id || m.project?.toLowerCase().includes(proj.name.toLowerCase())
                );
                setSelectedMoM(firstInProject || null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>{proj.name}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Items Assigned to You Callout */}
      {myActionItems.length > 0 && (
        <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-900">
            <ListTodo className="w-4 h-4 text-purple-600" />
            <span>Action Items Assigned to You from Meetings:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {myActionItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white border border-purple-200/80 rounded-xl text-xs flex items-start justify-between gap-2 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                      {item.projectCode}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {item.text}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    From: {item.momTitle} • Due: {item.due}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: List on Left, Selected MoM Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* MoM Selection List */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Meeting Records ({filteredMoMs.length})
          </span>

          {filteredMoMs.length === 0 ? (
            <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs space-y-2">
              <p>No meeting notes recorded for this project yet.</p>
              <button
                type="button"
                onClick={() => setIsAddMoMOpen(true)}
                className="text-purple-600 font-bold hover:underline"
              >
                + Add a meeting note
              </button>
            </div>
          ) : (
            filteredMoMs.map((mom) => {
              const isSelected = selectedMoM?.id === mom.id;
              return (
                <div
                  key={mom.id}
                  onClick={() => setSelectedMoM(mom)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-300 shadow-card'
                      : 'bg-white border-slate-200 hover:border-purple-200 shadow-card'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-purple-700 font-bold">{mom.project_code || 'PROJ'}</span>
                    <span>{mom.date}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {mom.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{mom.attendees} attendees</span>
                    <span>•</span>
                    <span className="truncate max-w-[140px]">{mom.project}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected MoM Details View */}
        <div className="lg:col-span-2">
          {selectedMoM ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {selectedMoM.project}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {selectedMoM.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {selectedMoM.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {selectedMoM.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {selectedMoM.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Organizer: <strong className="text-slate-700">{selectedMoM.organizer}</strong>
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  Meeting Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedMoM.summary}
                </p>
              </div>

              {/* Key Decisions */}
              {selectedMoM.decisions?.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Key Decisions & Approvals ({selectedMoM.decisions.length})
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {selectedMoM.decisions.map((dec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-50/40 border border-purple-100 text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items */}
              {selectedMoM.actionItems?.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-purple-600" />
                    <span>Agreed Action Items & Deadlines ({selectedMoM.actionItems.length})</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {selectedMoM.actionItems.map((act) => (
                      <div
                        key={act.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          act.isCurrentUser
                            ? 'bg-purple-50/70 border-purple-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {act.text}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Assignee: <strong>{act.assignee}</strong> • Due: {act.due}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            act.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {act.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              Select a meeting to view full minutes.
            </div>
          )}
        </div>
      </div>

      {/* Create Meeting Note Modal */}
      <CreateMeetingNoteModal
        isOpen={isAddMoMOpen}
        onClose={() => setIsAddMoMOpen(false)}
        preselectedProjectId={selectedProjectFilter !== 'ALL' ? selectedProjectFilter : null}
        onSuccess={(newMoM) => {
          setSelectedMoM(newMoM);
          onToast?.(`Added meeting note for ${newMoM.project}`);
        }}
        onToast={onToast}
      />
    </div>
  );
}
