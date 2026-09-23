import React from 'react';
import { mockForms } from '../../data/mockData';
import { FileText, Bell, Plus, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FormsView({ onAlertPendingForms }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Structured Forms & Submission Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">Collect progress updates, retrospective notes, and evaluations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAlertPendingForms}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold border border-purple-200 shadow-2xs transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alert All Pending</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Form</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockForms.map((form) => {
          const submissionRate = Math.round((form.submitted / form.assigned) * 100);
          return (
            <div
              key={form.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Target: <strong className="text-slate-700">{form.target}</strong>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3">{form.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline: {form.deadline}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Submission Rate</span>
                    <span className="font-bold text-slate-800">{submissionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${submissionRate}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown Stats */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <div className="text-xs font-bold text-slate-700">{form.assigned}</div>
                    <div className="text-[10px] text-slate-400">Assigned</div>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <div className="text-xs font-bold text-emerald-700">{form.submitted}</div>
                    <div className="text-[10px] text-emerald-600">Submitted</div>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-xl">
                    <div className="text-xs font-bold text-amber-700">{form.pending}</div>
                    <div className="text-[10px] text-amber-600">Pending</div>
                  </div>
                  <div className="bg-rose-50 p-2 rounded-xl">
                    <div className="text-xs font-bold text-rose-700">{form.overdue}</div>
                    <div className="text-[10px] text-rose-600">Overdue</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">ID: {form.id}</span>
                <button
                  onClick={onAlertPendingForms}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Alert Pending ({form.pending + form.overdue})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

