import React, { useState } from 'react';
import { mockInterns } from '../../data/mockData';
import { Search, AlertCircle, MessageSquare } from 'lucide-react';

export default function InternsView({ onPingIntern }) {
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInterns = mockInterns.filter((intern) => {
    const matchSearch = intern.name.toLowerCase().includes(search.toLowerCase()) ||
                        intern.project.toLowerCase().includes(search.toLowerCase()) ||
                        intern.email.toLowerCase().includes(search.toLowerCase());
    const matchSection = sectionFilter === 'All' || intern.section === sectionFilter;
    const matchStatus = statusFilter === 'All' || intern.status === statusFilter;
    return matchSearch && matchSection && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-md border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Intern Roster & Oversight</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and track 48 cohort members across 4 project tracks</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, project..."
              className="pl-8 pr-3 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 w-60"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Section:</span>
          {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'].map((sec) => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec)}
              className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${
                sectionFilter === sec
                  ? 'bg-purple-50 border border-purple-300 text-purple-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
          {['All', 'Active', 'Lagging'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-purple-50 border border-purple-300 text-purple-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Data Table: Intern Management */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3.5">Name</th>
                <th className="py-2.5 px-3.5">Section</th>
                <th className="py-2.5 px-3.5">Tech Lead</th>
                <th className="py-2.5 px-3.5">Project Track</th>
                <th className="py-2.5 px-3.5">Active Tasks</th>
                <th className="py-2.5 px-3.5">Overdue</th>
                <th className="py-2.5 px-3.5">Attendance</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInterns.map((intern) => (
                <tr key={intern.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                        {intern.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{intern.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{intern.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-3.5 text-slate-700">
                    <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      Sec {intern.section}
                    </span>
                  </td>

                  <td className="py-2 px-3.5 text-slate-700 font-medium">
                    {intern.lead}
                  </td>

                  <td className="py-2 px-3.5 text-slate-600">
                    {intern.project}
                  </td>

                  <td className="py-2 px-3.5 font-semibold text-slate-800">
                    {intern.tasksDone} / {intern.tasksTotal} done
                  </td>

                  <td className="py-2 px-3.5">
                    {intern.overdue > 0 ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {intern.overdue}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">0</span>
                    )}
                  </td>

                  <td className="py-2 px-3.5 font-medium text-slate-700">
                    {intern.attendance}
                  </td>

                  <td className="py-2 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      intern.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {intern.status}
                    </span>
                  </td>

                  <td className="py-2 px-3.5 text-right">
                    <button
                      onClick={() => onPingIntern?.(intern)}
                      className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Direct Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
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
