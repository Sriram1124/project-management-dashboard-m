import React from 'react';
import { mockProjectWorkspaceData } from '../../../data/projectWorkspaceData';
import ProjectFilesSection from './ProjectFilesSection';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  FileText, 
  Users 
} from 'lucide-react';

export default function ProjectOverviewTab({ onToast }) {
  const data = mockProjectWorkspaceData;

  return (
    <div className="space-y-6">
      {/* Project Overview & Status */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Executive Summary
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                {data.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                {data.sprint}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 max-w-4xl leading-relaxed">
          {data.description}
        </p>

        {/* Project Files Section */}
        <ProjectFilesSection onToast={onToast} />
      </div>

      {/* 6 Middle Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Epics</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data.activeEpicsCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">Database, Auth, Forms</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Sprint</span>
          <div className="text-xl font-extrabold text-purple-700 mt-1">{data.sprint}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Ends in 6 days</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data.totalTasksCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">8 stories, 4 subtasks</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion %</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{data.completionPercentage}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.completionPercentage}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue Tasks</span>
          <div className="text-2xl font-extrabold text-rose-500 mt-1">{data.overdueTasksCount}</div>
          <p className="text-[10px] text-rose-500 mt-0.5 font-semibold">SPS-203, SPS-207</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hours Logged</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data.hoursLogged}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">This week: {data.hoursLoggedWeek}</p>
        </div>
      </div>

      {/* Bottom 2 Columns: Sprint Progress (1 col) and Expanded Team Summary (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sprint Progress */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Sprint Progress</span>
              <span className="text-slate-400 text-[11px]">{data.sprintProgress.period}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">{data.sprintProgress.sprintName}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-normal">{data.sprintProgress.goal}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>Completed Tasks</span>
                <span className="text-purple-700 font-bold">{data.sprintProgress.completedTasks} / {data.sprintProgress.totalTasks} Tasks</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full" 
                  style={{ width: `${(data.sprintProgress.completedTasks / data.sprintProgress.totalTasks) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-base font-bold text-slate-700">{data.sprintProgress.todoCount}</span>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">To Do</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-xl">
              <span className="text-base font-bold text-purple-700">{data.sprintProgress.activeCount}</span>
              <div className="text-[10px] text-purple-600 uppercase font-semibold">Active</div>
            </div>
            <div className="bg-emerald-50 p-2 rounded-xl">
              <span className="text-base font-bold text-emerald-700">{data.sprintProgress.doneCount}</span>
              <div className="text-[10px] text-emerald-600 uppercase font-semibold">Done</div>
            </div>
          </div>
        </div>

        {/* Expanded Team Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Team Summary</span>
              <span className="text-slate-400 text-[11px] font-semibold">{data.teamSummary.contributorsCount} Contributors</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {/* Tech Lead item */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={data.teamSummary.lead.avatar}
                    alt={data.teamSummary.lead.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{data.teamSummary.lead.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{data.teamSummary.lead.role}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 shrink-0 ml-1">
                  {data.teamSummary.lead.badge}
                </span>
              </div>

              {/* Interns */}
              {data.teamSummary.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{member.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{member.role}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0 ml-1">
                    {member.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Project cohort allocation: Sections {data.sections.join(', ')}</span>
            <span className="font-medium text-slate-500">{data.teamSummary.contributorsCount} active contributors</span>
          </div>
        </div>
      </div>
    </div>
  );
}

