import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FolderKanban, 
  Calendar, 
  Clock, 
  FileText, 
  CheckSquare, 
  Users, 
  Zap, 
  Download, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Plus,
  ListTodo
} from 'lucide-react';
import PersonalKanbanBoard from './PersonalKanbanBoard';
import MySprintSection from './MySprintSection';
import CreateMeetingNoteModal from './CreateMeetingNoteModal';
import { workItemsService } from '../services/workItemsService';
import { momService } from '../services/momService';

export default function ScopedProjectView({
  project,
  onBack,
  onTaskClick,
  onToast
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'work' | 'sprint' | 'kanban' | 'documents' | 'mom'
  const [allMoMs, setAllMoMs] = useState(momService.getPublishedMoMs());
  const [isAddMoMOpen, setIsAddMoMOpen] = useState(false);

  useEffect(() => {
    const unsub = momService.subscribe(setAllMoMs);
    return () => unsub();
  }, []);

  // Filter items in this specific project assigned to the intern
  const projectTasks = workItemsService.getAllWorkItems().filter(
    (w) => w.project_id === project.id
  );

  const completedCount = projectTasks.filter((t) => t.status === 'COMPLETED').length;

  // Filter meeting notes strictly for this project
  const projectMoMs = allMoMs.filter(
    (m) => m.project_id === project.id || m.project?.toLowerCase().includes(project.name.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'work', label: `My Work (${projectTasks.length})` },
    { id: 'sprint', label: 'My Sprint' },
    { id: 'kanban', label: 'Personal Kanban' },
    { id: 'documents', label: `Project Documents (${project.documents?.length || 0})` },
    { id: 'mom', label: `Meeting Notes (${projectMoMs.length})` }
  ];

  return (
    <div className="space-y-4">
      {/* Top Context & Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card space-y-3">
        {/* Row 1: Back Button & Project Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Back to My Projects"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {project.code}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {project.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {project.name}
              </h2>
            </div>
          </div>

          {/* Intern's Role Context Callout */}
          <div className="flex items-center gap-3 text-xs bg-purple-50/70 border border-purple-100 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
            <div className="flex items-center gap-1.5 text-purple-900 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Tech Lead: {project.lead.name}</span>
            </div>
            <span className="text-purple-300">·</span>
            <span className="text-purple-700 font-medium">
              Your Role: Contributor ({projectTasks.length} Assigned Items)
            </span>
          </div>
        </div>

        {/* Row 2: Scoped Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Project Scope & Objective
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {project.description}
              </p>
            </div>

            {/* My Personal Assignment Summary in this Project */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                What Am I Doing in This Project?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 text-center">
                  <span className="text-[10px] font-bold text-purple-700 uppercase block">
                    My Deliverables
                  </span>
                  <span className="text-2xl font-extrabold text-purple-900 mt-0.5 block">
                    {projectTasks.length}
                  </span>
                  <span className="text-[10px] text-purple-600">Assigned Work Items</span>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                    Delivered
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-900 mt-0.5 block">
                    {completedCount}
                  </span>
                  <span className="text-[10px] text-emerald-600">Completed Tickets</span>
                </div>

                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">
                    Pending
                  </span>
                  <span className="text-2xl font-extrabold text-amber-900 mt-0.5 block">
                    {projectTasks.length - completedCount}
                  </span>
                  <span className="text-[10px] text-amber-600">Active Sprint Tasks</span>
                </div>
              </div>
            </div>

            {/* Recent Project Activity relevant to intern */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Recent Project Milestones & Updates
              </h3>
              <div className="space-y-2 text-xs">
                {project.recentActivity?.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <span className="text-slate-700 font-medium">{act.text}</span>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Work */}
      {activeTab === 'work' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              My Work Items in {project.name}
            </h3>
            <span className="text-xs text-slate-400">Click ticket to view details</span>
          </div>

          <div className="space-y-2">
            {projectTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onTaskClick?.(t)}
                className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {t.id}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    {t.type}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {t.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400">
                    Due {new Date(t.due_date).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Sprint */}
      {activeTab === 'sprint' && (
        <MySprintSection
          workItems={projectTasks}
          onTaskClick={onTaskClick}
          onToggleTask={(id) => {
            workItemsService.toggleComplete(id);
            onToast?.('Updated task status');
          }}
        />
      )}

      {/* Tab 4: Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Scoped Personal Kanban: {project.name}</span>
            <span>Drag cards to update your deliverable status</span>
          </div>
          <PersonalKanbanBoard
            workItems={projectTasks}
            onTaskClick={onTaskClick}
            onToast={onToast}
          />
        </div>
      )}

      {/* Tab 5: Documents (Project Documents strictly separate from Task Attachments) */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Project Specifications & Resources
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized project documentation separate from individual task attachments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.documents?.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 text-xs block truncate">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {doc.size} • Updated {doc.updated}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToast?.(`Downloading ${doc.name}...`)}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 rounded-lg transition-colors shrink-0"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Meeting Notes (Separately isolated for this project) */}
      {activeTab === 'mom' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-5">
          {/* Header with Project Title & Add Meeting Note Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  {project.code}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Project Meeting Notes ({projectMoMs.length})
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Meeting Records: {project.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Meeting minutes, architecture syncs, and agreed action items recorded specifically for {project.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddMoMOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Meeting Note</span>
            </button>
          </div>

          {/* Project-specific MoM List */}
          {projectMoMs.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-700">No meeting notes recorded yet for {project.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Create your first meeting note to keep track of decisions and assigned actions.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMoMOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Meeting Note</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projectMoMs.map((m) => (
                <div
                  key={m.id}
                  className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3.5 hover:border-purple-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {m.id}
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.2 rounded">
                          {m.project_code || project.code}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {m.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {m.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {m.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {m.attendees} attendees
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Summary & Discussion
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                      {m.summary}
                    </p>
                  </div>

                  {/* Decisions */}
                  {m.decisions?.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Key Decisions ({m.decisions.length})
                      </h5>
                      <ul className="space-y-1.5 text-xs">
                        {m.decisions.map((dec, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 p-2 rounded-lg bg-purple-50/50 border border-purple-100 text-slate-800"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                            <span>{dec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Items */}
                  {m.actionItems?.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                        <ListTodo className="w-3.5 h-3.5 text-purple-600" />
                        <span>Action Items ({m.actionItems.length})</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {m.actionItems.map((act) => (
                          <div
                            key={act.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              act.isCurrentUser
                                ? 'bg-purple-50/70 border-purple-200'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-semibold text-slate-800 block truncate">
                                {act.text}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {act.assignee} • Due {act.due}
                              </span>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
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

                  <div className="text-[10px] text-slate-400 pt-1">
                    Recorded by: <span className="font-medium text-slate-600">{m.organizer}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Meeting Note strictly for this project */}
      <CreateMeetingNoteModal
        isOpen={isAddMoMOpen}
        onClose={() => setIsAddMoMOpen(false)}
        preselectedProjectId={project.id}
        onSuccess={() => setAllMoMs(momService.getPublishedMoMs())}
        onToast={onToast}
      />
    </div>
  );
}
