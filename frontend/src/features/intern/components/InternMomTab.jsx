import React from 'react';
import { MessageSquare, Calendar, Users, FileText } from 'lucide-react';

export default function InternMomTab() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Minutes of Meeting (MoM)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Project meeting records, architecture syncs, and action items
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
          Planned for V2
        </span>
      </div>

      {/* V2 Placeholder Card */}
      <div className="bg-white rounded-2xl p-12 border border-slate-200/90 shadow-2xs text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Meeting Notes & Action Items (Coming in V2)
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
          Centralized meeting records, agendas, action item tracking, and export to PDF/Markdown are planned for the upcoming V2 release.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Meeting Syncs</span>
            </div>
            <p className="text-[11px] text-slate-400">Structured logs of team standups & retros</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold mb-1">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Action Items</span>
            </div>
            <p className="text-[11px] text-slate-400">Directly mapped accountability for interns</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold mb-1">
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>PDF / MD Export</span>
            </div>
            <p className="text-[11px] text-slate-400">Shareable artifacts for leadership reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
