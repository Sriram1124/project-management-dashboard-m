import React from 'react';
import { mockTechLeads } from '../../data/mockData';
import { ShieldCheck, Users, FolderKanban, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function TechLeadsView({ onRebalanceLead }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tech Leads & Section Oversight</h2>
          <p className="text-xs text-slate-500 mt-0.5">Supervise execution, PR review queues, and workload across 6 leads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockTechLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={lead.avatar}
                    alt={lead.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{lead.name}</h3>
                    <p className="text-[11px] text-slate-400">{lead.email}</p>
                  </div>
                </div>
                {lead.pendingReviews > 10 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Bottleneck
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <FolderKanban className="w-3.5 h-3.5 text-purple-600" />
                    <span>Assigned Projects:</span>
                  </span>
                  <span className="font-semibold text-right max-w-[160px] truncate">
                    {lead.projects.join(', ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>Sections / Interns:</span>
                  </span>
                  <span className="font-semibold">
                    {lead.assignedSections.join(', ')} • {lead.internsCount} Interns
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tasks Awaiting Review:</span>
                  </span>
                  <span className={`font-bold ${lead.pendingReviews > 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {lead.pendingReviews} tasks
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Review turnaround: ~24h</span>
              <button
                onClick={() => onRebalanceLead?.(lead)}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
              >
                <span>Manage Queue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

