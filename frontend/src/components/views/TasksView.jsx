import React, { useState } from 'react';
import { Search, CheckSquare, Plus } from 'lucide-react';

export default function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchSearch = (t.title && t.title.toLowerCase().includes(search.toLowerCase())) ||
                        (t.assignee && t.assignee.toLowerCase().includes(search.toLowerCase())) ||
                        (t.project && t.project.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-md border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Task Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational deadlines, epics, and assignment tracking across cohorts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tasks..."
              className="pl-8 pr-3 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 w-56"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
        {['All', 'In Progress', 'In Review', 'Blocked', 'Completed', 'To Do'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              statusFilter === tab
                ? 'bg-purple-50 border border-purple-300 text-purple-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table / Empty State */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckSquare className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Tasks Available</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Task assignment, status transitions, and work item management are planned for the V2 module.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Planned for V2
              </span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3.5 w-8">#</th>
                  <th className="py-2.5 px-3.5">ID</th>
                  <th className="py-2.5 px-3.5">Task</th>
                  <th className="py-2.5 px-3.5">Assignee</th>
                  <th className="py-2.5 px-3.5">Project</th>
                  <th className="py-2.5 px-3.5">Priority</th>
                  <th className="py-2.5 px-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3.5 font-mono text-[11px] text-slate-500">{task.id}</td>
                    <td className="py-2 px-3.5 text-slate-900 font-semibold">{task.title}</td>
                    <td className="py-2 px-3.5 text-slate-700">{task.assignee}</td>
                    <td className="py-2 px-3.5 text-slate-500">{task.project}</td>
                    <td className="py-2 px-3.5">{task.priority}</td>
                    <td className="py-2 px-3.5">{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
