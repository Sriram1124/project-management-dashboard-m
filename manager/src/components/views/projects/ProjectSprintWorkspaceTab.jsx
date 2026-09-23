import React, { useState } from 'react';
import { mockProjectWorkspaceData } from '../../../data/projectWorkspaceData';
import { 
  Plus, 
  ChevronDown, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Check, 
  Lock,
  User,
  Users,
  AlertTriangle
} from 'lucide-react';

export default function ProjectSprintWorkspaceTab({ onLogWork }) {
  const [columns, setColumns] = useState(mockProjectWorkspaceData.kanbanColumns);
  const [quickFilter, setQuickFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* 8. SPRINT WORKSPACE: INFORMATION-DENSE SPRINT SUMMARY */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* Sprint Details & Goal */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Sprint
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-900">Sprint 04</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Dec 1 – Dec 14, 2025</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700">Goal: </span>
              <span className="text-xs text-slate-600 leading-relaxed">
                Complete authentication, authorization, database schemas, and user-role management.
              </span>
            </div>

            {/* Inline Metrics Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-medium border-t border-slate-100 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">12</span>
                <span className="text-slate-500">committed</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-700">8</span>
                <span className="text-slate-500">completed</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-rose-700">2</span>
                <span className="text-slate-500">overdue</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">24 / 34</span>
                <span className="text-slate-500">SP</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">45h 20m</span>
                <span className="text-slate-500">logged</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-rose-700">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="font-bold">1</span>
                <span>blocked</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={onLogWork}
              className="px-3 py-1.5 rounded-md bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Work</span>
            </button>
            <button className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-slate-500" />
              <span>Complete Sprint</span>
            </button>
          </div>
        </div>

        {/* SPRINT BURNDOWN & HEALTH INLINE SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 mt-5 border-t border-slate-200">
          {/* Burndown Chart (8 cols) */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sprint Burndown
              </span>
              <span className="text-xs font-mono text-slate-500">24 SP remaining / 34 SP total</span>
            </div>

            <div className="h-28 w-full bg-slate-50/50 rounded-md border border-slate-200 p-3 flex flex-col justify-between">
              <svg viewBox="0 0 400 80" className="w-full h-20 overflow-visible">
                {/* Guidelines */}
                <line x1="10" y1="15" x2="390" y2="70" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
                {/* Actual Line */}
                <polyline
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="10,15 70,22 130,34 200,38 270,52 340,58 390,65"
                />
                {/* Points */}
                {[[10, 15], [70, 22], [130, 34], [200, 38], [270, 52], [340, 58], [390, 65]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="2.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1" />
                ))}
              </svg>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Dec 1 (Kickoff)</span>
                <span>Dec 5</span>
                <span>Dec 9</span>
                <span>Dec 14 (Target)</span>
              </div>
            </div>
          </div>

          {/* Project Health (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Project Health
            </div>

            <div className="rounded-md border border-slate-200 p-3 space-y-2.5 bg-slate-50/50 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Active Contributors:
                </span>
                <span className="font-semibold text-slate-900">6 Interns</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  Blocked Tasks:
                </span>
                <span className="font-semibold text-rose-700">1 Blocked</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-600">Completion Pace:</span>
                <span className="font-semibold text-emerald-700">On Track (71%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TASK STATUS OVERVIEW (COLUMNS WITH REDUCED RADII AND HIGH DENSITY) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Task Status
            </h3>
            <span className="text-xs text-slate-400">· 5 columns</span>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter:</span>
            <button 
              onClick={() => setQuickFilter(quickFilter === 'my-tasks' ? 'all' : 'my-tasks')}
              className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                quickFilter === 'my-tasks'
                  ? 'bg-purple-50 border-purple-300 text-purple-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              My Tasks
            </button>
            <button 
              onClick={() => setQuickFilter(quickFilter === 'overdue' ? 'all' : 'overdue')}
              className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                quickFilter === 'overdue'
                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Overdue
            </button>
          </div>
        </div>

        {/* 5 Columns with compact, restrained styling */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
          {columns.map((col) => (
            <div key={col.id} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col min-h-[380px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    col.id === 'todo' ? 'bg-slate-400' :
                    col.id === 'in-progress' ? 'bg-purple-600' :
                    col.id === 'in-review' ? 'bg-amber-500' :
                    col.id === 'blocked' ? 'bg-rose-600' : 'bg-emerald-600'
                  }`} />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{col.title}</h4>
                  <span className="text-[10px] font-semibold text-slate-500 px-1 py-0.2 rounded bg-white border border-slate-200">
                    {col.count}
                  </span>
                </div>
                <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-white transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Compact Task Cards */}
              <div className="space-y-2 flex-1">
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`p-2.5 rounded-md border bg-white transition-colors cursor-pointer ${
                      card.isOverdue 
                        ? 'border-rose-300 bg-rose-50/20' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${card.priorityBg}`}>
                        {card.priority}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{card.id}</span>
                    </div>

                    <h5 className="text-xs font-semibold text-slate-800 leading-snug">
                      {card.title}
                    </h5>

                    <div className="text-[10px] text-slate-400 mt-1">
                      {card.epic}
                    </div>

                    {/* Card Footer: Due & Assignee */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className={`text-[10px] font-medium ${card.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                          {card.due}
                        </span>
                      </div>

                      {card.assignee ? (
                        <img
                          src={card.assignee.avatar}
                          alt={card.assignee.name}
                          title={card.assignee.name}
                          className="w-4 h-4 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[9px] font-bold">
                          ?
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
