import React, { useState } from 'react';
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
  ListTodo,
  FileQuestion,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

import { projectsService } from '../../../services/projects.service';
import FilePreviewModal from '../../../components/views/projects/FilePreviewModal';

export default function ScopedProjectView({
  project,
  onBack,
  onTaskClick,
  onToast
}) {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'documents' | 'work' | 'sprint' | 'kanban' | 'mom'
  const [previewFile, setPreviewFile] = useState(null);

  if (!project) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
        <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Project Not Found</h3>
        <p className="text-xs text-slate-500">The requested project could not be loaded or is no longer accessible.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors"
        >
          Back to My Projects
        </button>
      </div>
    );
  }

  const documents = project.documents || [];
  const members = project.members || [];
  const ownerName = project.lead?.name || project.owner?.name || 'Project Owner';

  const handleDownloadDoc = async (doc) => {
    if (!project?.id) return;
    try {
      onToast?.(`Downloading ${doc.name}...`);
      await projectsService.downloadDocument(project.id, doc.id, doc.name);
    } catch (err) {
      onToast?.(err?.message || 'Failed to download document');
    }
  };

  const handlePreviewDoc = (doc) => {
    const ext = (doc.name ? doc.name.split('.').pop().toLowerCase() : (doc.type || 'file'));
    const isImg = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
    setPreviewFile({
      id: doc.id,
      name: doc.name,
      type: ext,
      uploadedAt: doc.updated || 'Recently',
      isImage: isImg,
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: `Project Documents (${documents.length})` },
    { id: 'work', label: 'My Work (Planned for V2)' },
    { id: 'sprint', label: 'My Sprint (Planned for V2)' },
    { id: 'kanban', label: 'Personal Kanban (Planned for V2)' },
    { id: 'mom', label: 'Meeting Notes (Planned for V2)' }
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
                  {project.code || (project.id ? project.id.slice(0, 8).toUpperCase() : 'PROJ')}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {project.status || 'ACTIVE'}
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
              <span>Project Owner: {ownerName}</span>
            </div>
            <span className="text-purple-300">·</span>
            <span className="text-purple-700 font-medium">
              Role: {authUser?.role || 'Intern'}
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
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-5">
            {/* Scope */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Project Scope & Objective
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {project.description || 'No description provided.'}
              </p>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Project Owner
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {ownerName}
                </span>
                <span className="text-[10px] text-slate-500">Project Lead</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Timeline
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {project.startDate || 'TBD'} - {project.endDate || 'TBD'}
                </span>
                <span className="text-[10px] text-slate-500">Scheduled Duration</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Assigned Team
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </span>
                <span className="text-[10px] text-slate-500">Active Collaborators</span>
              </div>
            </div>

            {/* Team Members List */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Project Team Members ({members.length})
              </h3>
              {members.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  No other members currently assigned to this project.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5"
                    >
                      <img
                        src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`}
                        alt={m.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {m.email || 'Team Member'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Project Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Project Specifications & Documents
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized project documentation uploaded and managed for this project
              </p>
            </div>
          </div>

          {documents.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
              <FileQuestion className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No project documents yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Documents uploaded to this project will appear here for all team members.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documents.map((doc) => {
                const ext = (doc.name.split('.').pop() || 'FILE').toUpperCase();
                return (
                  <div
                    key={doc.id}
                    onClick={() => handlePreviewDoc(doc)}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-purple-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {ext}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate" title={doc.name}>
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Uploaded {doc.updated || 'Recently'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDoc(doc);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          projectId={project.id}
          onClose={() => setPreviewFile(null)}
          onDownload={(f) => handleDownloadDoc(f)}
        />
      )}

      {/* Tab 3: My Work (V2 Placeholder) */}
      {activeTab === 'work' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-card text-center space-y-3">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">My Work Items — Planned for V2</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Individual task assignment, story point estimation, and deliverable ticket tracking will be enabled in Phase 2 of the Project Management platform.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Work Items Module Scheduled for V2</span>
          </div>
        </div>
      )}

      {/* Tab 4: My Sprint (V2 Placeholder) */}
      {activeTab === 'sprint' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-card text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Sprint Management — Planned for V2</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Active sprint iteration tracking, burn-down velocity, and sprint retrospective deliverables will be available in V2.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sprint Cycles Scheduled for V2</span>
          </div>
        </div>
      )}

      {/* Tab 5: Personal Kanban (V2 Placeholder) */}
      {activeTab === 'kanban' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-card text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Personal Kanban Board — Planned for V2</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Drag-and-drop interactive kanban columns and real-time state synchronization will be introduced in V2.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kanban Board Scheduled for V2</span>
          </div>
        </div>
      )}

      {/* Tab 6: Meeting Notes (V2 Placeholder) */}
      {activeTab === 'mom' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-card text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Meeting Notes (MoM) — Planned for V2</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Recording meeting minutes, AI transcription summaries, attendee check-ins, and actionable decision items are scheduled for V2.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Minutes of Meeting Module Scheduled for V2</span>
          </div>
        </div>
      )}
    </div>
  );
}
