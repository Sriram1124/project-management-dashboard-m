import React from 'react';
import { 
  FolderKanban, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { projectsService } from '../services/projectsService';

export default function MyProjectsTab({ onSelectProject }) {
  const myProjects = projectsService.getMyProjects();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PLANNED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ARCHIVED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-purple-600" />
            <span>My Projects</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Projects you are assigned to as an active contributor or collaborator
          </p>
        </div>
        <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full w-fit">
          {myProjects.length} Active Memberships
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:border-purple-300 hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Top Row: Code, Status, Lead */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {p.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {p.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-xl">
                  <img
                    src={p.lead.avatar}
                    alt={p.lead.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="text-right pr-1">
                    <span className="text-[10px] font-bold text-slate-800 block leading-tight">
                      {p.lead.name}
                    </span>
                    <span className="text-[9px] text-slate-400 block leading-none">
                      {p.lead.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {p.description}
              </p>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Sprint Velocity & Completion
                  </span>
                  <span className="font-bold text-slate-900">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              {/* Assigned Work Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    My Tasks
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {p.assignedWork.total}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    In Progress
                  </span>
                  <span className="text-sm font-extrabold text-purple-700">
                    {p.assignedWork.inProgress}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Completed
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600">
                    {p.assignedWork.completed}
                  </span>
                </div>
              </div>

              {/* Dates & Members */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {p.startDate} - {p.endDate}
                </span>

                <div className="flex items-center -space-x-1.5">
                  {p.members.map((m) => (
                    <img
                      key={m.id}
                      src={m.avatar}
                      alt={m.name}
                      title={`${m.name} (${m.role})`}
                      className="w-5 h-5 rounded-full border border-white object-cover"
                    />
                  ))}
                  <span className="text-[10px] font-bold text-slate-500 pl-2">
                    {p.members.length} members
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button: Opens existing project details interface */}
            <div className="pt-4 mt-2">
              <button
                type="button"
                onClick={() => onSelectProject?.(p.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all active:scale-[0.99]"
              >
                <span>Open Project Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
