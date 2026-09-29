import React, { useState } from 'react';
import { mockProjectWorkspaceData } from '../../../data/projectWorkspaceData';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProjectRoadmapTab() {
  const data = mockProjectWorkspaceData;
  const [viewMode, setViewMode] = useState('Sprints');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const sprints = data.roadmapTimeline.sprints;
  const epics = data.roadmapTimeline.epicsGantt.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.lead.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Gantt Roadmap & Sprint Timelines
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Track high-level deliverables mapped directly to sprint intervals. Drag or adjust epic durations to align with program milestones and student cohort timelines.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-3">
              <span>Tech Lead: <strong className="text-slate-800">{data.lead.name}</strong></span>
              <span>•</span>
              <span>Active Sprints: <strong className="text-purple-700">Sprint 04 — Sprint 07</strong></span>
            </div>
          </div>

          {/* Right Stat Cards */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-5 py-3 rounded-2xl bg-purple-50/80 border border-purple-100 text-center min-w-[110px]">
              <span className="text-xl font-extrabold text-purple-700">4</span>
              <div className="text-[10px] font-bold text-purple-900/60 uppercase mt-0.5">Total Epics</div>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-center min-w-[110px]">
              <span className="text-xl font-extrabold text-emerald-600">82%</span>
              <div className="text-[10px] font-bold text-emerald-900/60 uppercase mt-0.5">Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search epics..."
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 w-full"
            />
          </div>

          {/* Status Dropdown */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <span>All Statuses</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Owner Dropdown */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <span>All Owners</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* View Segmented Toggle (Weeks / Sprints / Months) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold self-start md:self-auto">
          {['Weeks', 'Sprints', 'Months'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === mode
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Gantt Matrix Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header row: Sprints */}
          <div className="grid grid-cols-12 border-b border-slate-200 text-xs font-semibold text-slate-600 divide-x divide-slate-100">
            <div className="col-span-4 p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Epic Name & Owner
            </div>
            {sprints.slice(0, 4).map((sprint, i) => (
              <div 
                key={sprint.id} 
                className={`col-span-2 p-3 text-center ${
                  sprint.isActive ? 'bg-purple-50/70 border-t-2 border-t-purple-600' : 'bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={`text-xs font-bold ${sprint.isActive ? 'text-purple-700' : 'text-slate-800'}`}>
                    {sprint.name}
                  </span>
                  {sprint.isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{sprint.dates}</div>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100 text-xs">
            {epics.map((epic) => (
              <div key={epic.id} className="grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors divide-x divide-slate-100">
                {/* Epic Metadata (4 cols) */}
                <div className="col-span-4 p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {epic.id}
                    </span>
                    <span className="font-bold text-slate-800 hover:text-purple-700 transition-colors cursor-pointer">
                      {epic.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 pl-1">
                    {epic.lead}
                  </div>
                </div>

                {/* Timeline Visual Area (8 cols = 4 sprints * 2 cols each) */}
                <div className="col-span-8 p-3 relative grid grid-cols-4 gap-2">
                  {/* Visual Gantt Bar placed across columns */}
                  <div 
                    className={`py-2 px-3 rounded-xl shadow-xs text-xs font-semibold flex items-center justify-between transition-transform hover:scale-[1.01] ${epic.color}`}
                    style={{
                      gridColumnStart: epic.startCol,
                      gridColumnEnd: `span ${epic.spanCols}`,
                    }}
                  >
                    <span className="truncate">{epic.label}</span>
                    <span className="text-[10px] font-bold shrink-0 ml-2">{epic.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

