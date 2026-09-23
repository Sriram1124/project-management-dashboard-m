import React from 'react';
import BurndownChart from './BurndownChart';
import { Check, Plus, AlertTriangle } from 'lucide-react';

export default function SprintSummary({
  sprintGoal = 'Complete authentication, authorization, database schemas, and user-role management.',
  committedCount = 12,
  completedCount = 8,
  overdueCount = 2,
  storyPointsCompleted = 24,
  storyPointsTotal = 34,
  hoursLogged = '45h 20m',
  activeContributors = 6,
  blockedCount = 1,
  isSprintCompleted = false,
  onLogWork,
  onCompleteSprint,
}) {
  const completionPercentage = Math.round((storyPointsCompleted / storyPointsTotal) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* COLUMN 1 — SPRINT GOAL */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sprint Goal
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
              Active Sprint
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {sprintGoal}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-2">
            <span>Sprint Burndown Timeline</span>
            <span className="font-bold text-purple-700">24 SP Total</span>
          </div>

          <BurndownChart />
        </div>
      </div>

      {/* COLUMN 2 — SPRINT PROGRESS */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sprint Progress
            </span>
          </div>

          {/* Three Metric Boxes */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* COMMITTED */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                {committedCount}
              </span>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                Committed
              </div>
            </div>

            {/* COMPLETED */}
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100/80">
              <span className="text-xl font-extrabold text-emerald-600 tracking-tight">
                {completedCount}
              </span>
              <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide mt-0.5">
                Completed
              </div>
            </div>

            {/* OVERDUE */}
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100/80">
              <span className="text-xl font-extrabold text-rose-500 tracking-tight">
                {overdueCount}
              </span>
              <div className="text-[10px] font-semibold text-rose-600 uppercase tracking-wide mt-0.5">
                Overdue
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium text-[11px]">
              Story Points Completed
            </span>
            <span className="font-bold text-slate-800">
              {storyPointsCompleted} / {storyPointsTotal} SP
            </span>
          </div>

          {/* Progress Bar (Green fill, rounded ends) */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Hours Logged</span>
            <span className="font-bold text-slate-800">{hoursLogged}</span>
          </div>
        </div>
      </div>

      {/* COLUMN 3 — PROJECT HEALTH */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Project Health
            </span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
              isSprintCompleted
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              {isSprintCompleted ? 'SPRINT COMPLETED' : 'ON TRACK'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Active Contributors:</span>
              <span className="font-bold text-slate-800">{activeContributors} Interns</span>
            </div>

            {/* Subtle yellow/orange warning treatment */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
              <span className="text-amber-800 font-medium">Blocked Tasks:</span>
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                {blockedCount} Blocked
              </span>
            </div>
          </div>
        </div>

        {/* Two Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
          <button
            onClick={onLogWork}
            className="flex-1 py-2 px-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-all text-center flex items-center justify-center gap-1 active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Work</span>
          </button>

          <button
            onClick={onCompleteSprint}
            disabled={isSprintCompleted}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center flex items-center justify-center gap-1 ${
              isSprintCompleted
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 active:scale-[0.98]'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSprintCompleted ? 'Completed' : 'Complete Sprint'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

