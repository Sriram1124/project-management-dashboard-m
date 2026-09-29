import React, { useState } from 'react';
import { mockTasks } from '../../data/mockData';
import { Search, CheckCircle2, Lock, Clock, Plus } from 'lucide-react';

export default function TasksView() {
  const [tasks, setTasks] = useState(mockTasks);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...t, status: nextStatus, progress: nextStatus === 'Completed' ? 100 : 50 };
      }
      return t;
    }));
  };

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.assignee.toLowerCase().includes(search.toLowerCase()) ||
                        t.project.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* 10. ADMINISTRATIVE TABLE: TASK MANAGEMENT */}
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

      {/* Enterprise Data Table */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3.5 w-10">Done</th>
                <th className="py-2.5 px-3.5 w-24">ID</th>
                <th className="py-2.5 px-3.5">Task</th>
                <th className="py-2.5 px-3.5">Assignee</th>
                <th className="py-2.5 px-3.5">Project / Section</th>
                <th className="py-2.5 px-3.5">Priority</th>
                <th className="py-2.5 px-3.5">Due Date</th>
                <th className="py-2.5 px-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((task) => {
                const isCompleted = task.status === 'Completed';
                const isBlocked = task.status === 'Blocked';
                const isOverdue = task.due.includes('Overdue');

                return (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3.5">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-slate-300 hover:border-purple-600 bg-white'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                    </td>

                    <td className="py-2 px-3.5 font-mono text-[11px] text-slate-500">
                      {task.id}
                    </td>

                    <td className="py-2 px-3.5 text-slate-900 font-semibold">
                      <span className={isCompleted ? 'line-through text-slate-400 font-normal' : ''}>
                        {task.title}
                      </span>
                    </td>

                    <td className="py-2 px-3.5 text-slate-700">
                      {task.assignee}
                    </td>

                    <td className="py-2 px-3.5 text-slate-500">
                      <span>{task.project}</span>
                      <span className="text-slate-300 mx-1">·</span>
                      <span>Sec {task.section}</span>
                    </td>

                    <td className="py-2 px-3.5">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                        task.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {task.priority}
                      </span>
                    </td>

                    <td className="py-2 px-3.5">
                      <span className={`text-[11px] font-medium ${
                        isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'
                      }`}>
                        {task.due}
                      </span>
                    </td>

                    <td className="py-2 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1 ${
                        isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isBlocked ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold' :
                        task.status === 'In Review' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isBlocked && <Lock className="w-2.5 h-2.5" />}
                        {task.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
