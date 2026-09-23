import React, { useState } from 'react';
import { mockProjects } from '../../data/mockData';
import { FolderKanban, Plus, Search, Users, Shield, ArrowUpRight } from 'lucide-react';

export default function ProjectsView() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockProjects.filter((p) => {
    const matchFilter = filter === 'All' || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.lead.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Projects & Workstreams</h2>
          <p className="text-xs text-slate-500 mt-0.5">8 active engineering and research tracks under management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects or leads..."
              className="pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 w-64 shadow-xs"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>New Track</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        {['All', 'On Track', 'At Risk', 'Behind'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-purple-100 text-purple-700'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  proj.statusType === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                  proj.statusType === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  'bg-rose-50 text-rose-600 border border-rose-200'
                }`}>
                  {proj.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-3">{proj.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{proj.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-500" />
                    <span>Tech Lead:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{proj.lead}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-500" />
                    <span>Section & Interns:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{proj.section} • {proj.internsCount} Interns</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Completion</span>
                <span className="font-bold text-slate-700">{proj.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    proj.statusType === 'success' ? 'bg-emerald-500' :
                    proj.statusType === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

