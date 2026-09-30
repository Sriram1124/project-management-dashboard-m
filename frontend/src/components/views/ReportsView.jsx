import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Intern Performance Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cohort evaluation metrics, velocity analytics, and review turnaround</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-card text-center">
        <BarChart3 className="w-10 h-10 text-purple-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Report Data Available</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Comprehensive performance evaluation cards, velocity trends, and evaluation exports are planned for the V2 module.
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
