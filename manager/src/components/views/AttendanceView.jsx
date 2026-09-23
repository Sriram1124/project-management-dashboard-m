import React from 'react';
import { CalendarCheck, AlertCircle, CheckCircle2, UserX, Clock, Download } from 'lucide-react';
import { mockInterns } from '../../data/mockData';

export default function AttendanceView() {
  const missedAttendanceInterns = mockInterns.filter(i => parseInt(i.attendance) < 85);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance & Session Participation</h2>
          <p className="text-xs text-slate-500 mt-0.5">Overall 85% attendance across sprints, standups, and workshop sessions</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors">
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Timesheet CSV</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Rate</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">85.4%</div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">✔ Target met (&gt;80%)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repeat Absences</span>
          <div className="text-3xl font-extrabold text-rose-600 mt-2">{missedAttendanceInterns.length}</div>
          <p className="text-xs text-rose-500 font-semibold mt-1">Requires manager review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Section Highest Rate</span>
          <div className="text-3xl font-extrabold text-purple-700 mt-2">95.2%</div>
          <p className="text-xs text-slate-500 font-medium mt-1">Section D1 (Cloud DevOps)</p>
        </div>
      </div>

      {/* Interns with Flagged Attendance */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>Interns Requiring Attendance Review (&lt; 85%)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Intern Name</th>
                <th className="py-3 px-4">Section & Track</th>
                <th className="py-3 px-4">Tech Lead</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Missed Sessions</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {missedAttendanceInterns.map((intern) => (
                <tr key={intern.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{intern.name}</td>
                  <td className="py-3 px-4 text-slate-600">{intern.project} (Sec {intern.section})</td>
                  <td className="py-3 px-4 text-slate-600">{intern.lead}</td>
                  <td className="py-3 px-4 font-bold text-rose-600">{intern.attendance}</td>
                  <td className="py-3 px-4 text-slate-500">3 sessions missed</td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                      Ping Intern
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

