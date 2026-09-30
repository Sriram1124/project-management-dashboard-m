import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, MessageSquare, Users, Loader2 } from 'lucide-react';
import { projectsService } from '../../services/projects.service';

export default function InternsView({ onPingIntern }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    projectsService.getUsers()
      .then((data) => setUsers(data?.users || []))
      .catch((err) => console.error('Failed to load users:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-md border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Organization Members & Interns</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and track {users.length} active organization members</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, role..."
              className="pl-8 pr-3 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 w-60"
            />
          </div>
        </div>
      </div>

      {/* Enterprise Data Table: User Management */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            <span className="text-xs font-medium">Loading organization members...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No Members Found</p>
            <p className="text-xs text-slate-400 mt-0.5">No members match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3.5">Name</th>
                  <th className="py-2.5 px-3.5">Email</th>
                  <th className="py-2.5 px-3.5">Role</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-slate-900">{user.name || 'Member'}</div>
                      </div>
                    </td>

                    <td className="py-2 px-3.5 text-slate-600 font-mono text-[11px]">
                      {user.email}
                    </td>

                    <td className="py-2 px-3.5 text-slate-700">
                      <span className="font-mono text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {user.role || 'MEMBER'}
                      </span>
                    </td>

                    <td className="py-2 px-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>

                    <td className="py-2 px-3.5 text-right">
                      <button
                        onClick={() => onPingIntern?.(user)}
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
        )}
      </div>
    </div>
  );
}
