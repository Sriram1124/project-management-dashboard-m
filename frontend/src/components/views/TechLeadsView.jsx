import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, FolderKanban, Loader2 } from 'lucide-react';
import { projectsService } from '../../services/projects.service';

export default function TechLeadsView({ onRebalanceLead }) {
  const [techLeads, setTechLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsService.getUsers()
      .then((data) => {
        const leads = (data?.users || []).filter((u) => u.role === 'TECH_LEAD');
        setTechLeads(leads);
      })
      .catch((err) => console.error('Failed to load tech leads:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tech Leads & Oversight</h2>
          <p className="text-xs text-slate-500 mt-0.5">Supervise execution, architecture, and project lead assignments</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-xs font-medium">Loading tech leads...</span>
        </div>
      ) : techLeads.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-card">
          <ShieldCheck className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Tech Leads Assigned</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            There are currently no users with the Tech Lead role in your organization.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {techLeads.map((lead) => {
            const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name || 'Lead')}&background=7C3AED&color=fff`;
            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar}
                        alt={lead.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-100"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{lead.name}</h3>
                        <p className="text-[11px] text-slate-400 font-mono">{lead.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Role:</span>
                      </span>
                      <span className="font-semibold text-purple-700">Tech Lead</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
