import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Calendar,
  Filter,
  ArrowRight
} from 'lucide-react';
import { formsService } from '../services/formsService';

export default function AssignedFormsTab({
  forms = [],
  onOpenFormModal
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'OVERDUE' | 'SUBMITTED'

  const pendingForms = forms.filter((f) => f.submission_status === 'PENDING');
  const overdueForms = forms.filter((f) => formsService.isOverdue(f));
  const submittedForms = forms.filter((f) => f.submission_status === 'SUBMITTED');

  const filtered = forms.filter((f) => {
    if (filter === 'PENDING') return f.submission_status === 'PENDING';
    if (filter === 'OVERDUE') return formsService.isOverdue(f);
    if (filter === 'SUBMITTED') return f.submission_status === 'SUBMITTED';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Assigned Forms & Submissions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cohort evaluations, weekly retrospectives, and timesheet confirmations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {overdueForms.length > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{overdueForms.length} Overdue</span>
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200">
            {pendingForms.length} Pending
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Forms', count: forms.length },
          { id: 'PENDING', label: 'Pending Action', count: pendingForms.length },
          { id: 'OVERDUE', label: 'Overdue', count: overdueForms.length },
          { id: 'SUBMITTED', label: 'Submitted', count: submittedForms.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === tab.id
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filter === tab.id
                    ? 'bg-purple-800 text-white'
                    : tab.id === 'OVERDUE'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Forms Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-3 text-purple-400" />
          <h4 className="font-bold text-slate-800 text-base">No Forms Available</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Form evaluations, progress surveys, and cohort check-ins are planned for the V2 module.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Planned for V2
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((form) => {
          const isSubmitted = form.submission_status === 'SUBMITTED';
          const isOverdue = formsService.isOverdue(form);

          return (
            <div
              key={form.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-card ${
                isOverdue
                  ? 'border-rose-200 hover:border-rose-400'
                  : isSubmitted
                  ? 'border-slate-200 opacity-90'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {form.category || 'Cohort Form'}
                  </span>

                  {isSubmitted ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Submitted
                    </span>
                  ) : isOverdue ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 text-rose-600" /> Overdue
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Pending Submission
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {form.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {form.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Deadline: {new Date(form.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isSubmitted && form.submitted_at && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    Submitted on {new Date(form.submitted_at).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => onOpenFormModal?.(form)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                    isSubmitted
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : isOverdue
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitted ? 'View Submission Receipt' : 'Open & Submit Form'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
