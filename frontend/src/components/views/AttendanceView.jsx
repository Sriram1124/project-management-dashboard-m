import React from 'react';
import { CalendarCheck } from 'lucide-react';

export default function AttendanceView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance & Session Participation</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cohort attendance tracking, standup check-ins, and timesheets</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-card text-center">
        <CalendarCheck className="w-10 h-10 text-purple-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Attendance Records Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Daily session attendance tracking, automated check-ins, and timesheet exports are planned for the V2 module.
        </p>
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Planned for V2
          </span>
        </div>
      </div>
    </div>
  );
}
