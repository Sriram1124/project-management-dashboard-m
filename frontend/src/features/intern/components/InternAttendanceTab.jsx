import React from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  TrendingUp, 
  Download 
} from 'lucide-react';
import { attendanceService } from '../services/attendanceService';

export default function InternAttendanceTab({ onToast }) {
  const records = attendanceService.getAttendanceForUser();
  const stats = attendanceService.getAttendanceStats();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ABSENT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HALF_DAY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-purple-600" />
            <span>My Attendance & Time Logs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal attendance record associated with your authenticated profile
          </p>
        </div>

        <button
          onClick={() => onToast?.('Exporting attendance timesheet CSV...')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Timesheet</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Overall Rate
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats.rate}
          </div>
          <span className="text-xs text-emerald-600 font-semibold block mt-0.5">
            ✔ Target met (&gt;85%)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Sessions Present
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats.present}
          </div>
          <span className="text-xs text-slate-400 block mt-0.5">
            {stats.sessionsCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            On-Time Streak
          </span>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">
            {stats.currentStreak}
          </div>
          <span className="text-xs text-slate-400 block mt-0.5">
            Consecutive on-time check-ins
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Absences / Late
          </span>
          <div className="text-2xl font-extrabold text-amber-500 mt-1">
            {stats.late + stats.absent}
          </div>
          <span className="text-xs text-slate-400 block mt-0.5">
            {stats.late} Late • {stats.absent} Absent
          </span>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Daily Session History
          </h3>
          <span className="text-[11px] text-slate-400">
            One entry per calendar working day
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Hours Logged</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <CalendarCheck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No Attendance Records Yet</p>
                    <p className="text-xs text-slate-400 mt-0.5">Automated session check-ins and timesheets are planned for V2.</p>
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {r.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {r.check_in}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {r.check_out}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {r.hours}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
