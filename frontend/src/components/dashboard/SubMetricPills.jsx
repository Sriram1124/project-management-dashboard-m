import React from 'react';
import { Clock, Calendar, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';

export default function SubMetricPills({ onPillClick }) {
  const pills = [
    {
      id: 'missed-deadlines',
      icon: Clock,
      count: 12,
      label: 'Missed Deadlines',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'missed-attendance',
      icon: Calendar,
      count: 7,
      label: 'Missed Attendance',
      iconBg: 'bg-rose-100 text-rose-500',
    },
    {
      id: 'active-leads',
      icon: ShieldCheck,
      count: 6,
      label: 'Active Tech Leads',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'blocked-tasks',
      icon: AlertTriangle,
      count: 9,
      label: 'Blocked Tasks',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'pending-forms',
      icon: FileText,
      count: 8,
      label: 'Pending Forms',
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {pills.map((pill) => {
        const Icon = pill.icon;
        return (
          <button
            key={pill.id}
            onClick={() => onPillClick?.(pill.id)}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all text-left group"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${pill.iconBg} transition-transform group-hover:scale-105`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                {pill.count}
              </span>
              <span className="text-xs font-medium text-slate-500 leading-tight">
                {pill.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

