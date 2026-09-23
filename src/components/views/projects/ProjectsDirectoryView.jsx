import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';

export default function ProjectsDirectoryView({ onSelectProject }) {
  const [statusFilter, setStatusFilter] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 'PROJ-SMS-2025',
      name: 'Student Management System',
      lead: 'Priya Sharma',
      leadRole: 'Tech Lead',
      leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      section: 'A1',
      internsCount: 12,
      timelineStart: 'Dec 1, 2025',
      timelineEnd: 'Mar 31, 2026',
      timelineMeta: '104 days remaining',
      progress: 80,
      progressColor: 'bg-emerald-500',
      status: 'Active',
      statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      id: 'PROJ-AIR-2025',
      name: 'AI Research Platform',
      lead: 'Vikram Joshi',
      leadRole: 'Tech Lead',
      leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      section: 'B2',
      internsCount: 8,
      timelineStart: 'Nov 15, 2025',
      timelineEnd: 'Feb 15, 2026',
      timelineMeta: '59 days remaining',
      progress: 65,
      progressColor: 'bg-amber-500',
      status: 'Active',
      statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      id: 'PROJ-MAD-2025',
      name: 'Mobile App Development',
      lead: 'Rohan Singh',
      leadRole: 'Tech Lead',
      leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      section: 'C1',
      internsCount: 10,
      timelineStart: 'Oct 10, 2025',
      timelineEnd: 'Jan 15, 2026',
      timelineMeta: '28 days remaining',
      progress: 44,
      progressColor: 'bg-rose-500',
      status: 'Active',
      statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      id: 'PROJ-CAM-2025',
      name: 'Cloud Architecture Migration',
      lead: 'Unassigned Lead',
      isUnassigned: true,
      section: 'D1',
      internsCount: 6,
      timelineStart: 'Jan 1, 2026',
      timelineEnd: 'Apr 30, 2026',
      timelineMeta: 'Not started',
      progress: 0,
      progressColor: 'bg-slate-300',
      status: 'Draft',
      statusStyle: 'bg-slate-100 text-slate-600 border-slate-200',
    },
  ];

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Projects</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, manage, and safely archive or delete workspace projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter pill */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-purple-300 shadow-2xs transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Status: <strong className="text-purple-700 font-bold">{statusFilter}</strong></span>
            <span className="text-slate-400 ml-1">+</span>
          </button>

          {/* Create Project CTA button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Project Details</th>
                <th className="py-3.5 px-6">Tech Lead</th>
                <th className="py-3.5 px-6">Sections & Interns</th>
                <th className="py-3.5 px-6">Timeline</th>
                <th className="py-3.5 px-6">Progress</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((proj) => (
                <tr 
                  key={proj.id}
                  onClick={() => onSelectProject?.(proj.id)}
                  className="hover:bg-purple-50/40 transition-colors cursor-pointer group"
                >
                  {/* Project Details */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/80 shrink-0 group-hover:scale-105 transition-transform">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors text-xs leading-snug">
                          {proj.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          ID: {proj.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tech Lead */}
                  <td className="py-4 px-6">
                    {proj.isUnassigned ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                        Unassigned Lead
                      </span>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <img
                          src={proj.leadAvatar}
                          alt={proj.lead}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-200"
                        />
                        <span className="font-semibold text-slate-800 text-xs">
                          {proj.lead}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Sections & Interns */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-purple-100 text-purple-700 border border-purple-200/60">
                        {proj.section}
                      </span>
                      <span className="text-slate-500 font-medium text-xs">
                        {proj.internsCount} interns assigned
                      </span>
                    </div>
                  </td>

                  {/* Timeline */}
                  <td className="py-4 px-6">
                    <div className="text-slate-800 font-medium text-xs">
                      {proj.timelineStart} — {proj.timelineEnd}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {proj.timelineMeta}
                    </div>
                  </td>

                  {/* Progress */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 max-w-[120px]">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${proj.progressColor}`}
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-8 text-right">
                        {proj.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${proj.statusStyle}`}>
                      {proj.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        title="Edit Project"
                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        title="Delete Project"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1-4 of 4 active projects</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

