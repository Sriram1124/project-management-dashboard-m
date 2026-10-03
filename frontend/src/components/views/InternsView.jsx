import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Users, 
  Loader2, 
  UserPlus, 
  Upload, 
  KeyRound,
  UserX,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { usersService } from '../../services/users.service';
import AddMemberModal from '../modals/AddMemberModal';
import CredentialModal from '../modals/CredentialModal';
import BulkImportModal from '../modals/BulkImportModal';
import UserDetailModal from '../modals/UserDetailModal';
import ResetPasswordModal from '../modals/ResetPasswordModal';
import DeactivateUserModal from '../modals/DeactivateUserModal';

export default function InternsView({ onPingIntern }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE' | 'INTERN' | 'EMPLOYEE'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [credentialModalData, setCredentialModalData] = useState(null);

  // User management modals
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    usersService.getUsers(activeTab)
      .then((data) => setUsers(data?.users || []))
      .catch((err) => console.error('Failed to load users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleCreatedSuccess = (result) => {
    setIsAddModalOpen(false);
    fetchUsers();
    setCredentialModalData(result);
  };

  const handleBulkSuccess = () => {
    fetchUsers();
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.user_code && u.user_code.toLowerCase().includes(q)) ||
      (u.type && u.type.toLowerCase().includes(q))
    );
  });

  const tabOptions = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'INACTIVE', label: 'Inactive' },
    { key: 'INTERN', label: 'Interns' },
    { key: 'EMPLOYEE', label: 'Employees' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Organization Members &amp; Provisioning
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, provision, view, and administer interns and employees in your organization.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Bulk Import CSV
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Add New
          </button>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        
        {/* Type & Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, User ID..."
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 w-64 shadow-2xs"
          />
        </div>
      </div>

      {/* Enterprise Data Table: Member List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            <span className="text-xs font-medium">Loading organization members...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No Members Found</p>
            <p className="text-xs text-slate-400 mt-1">
              {search ? 'No members match your search query.' : 'Click "+ Add New" or "Bulk Import CSV" to provision members.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role / Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-900">{user.name || 'Member'}</div>
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
                      <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {user.user_code || '—'}
                      </span>
                    </td>

                    <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">
                      {user.email}
                    </td>

                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.type === 'INTERN'
                          ? 'bg-purple-100 text-purple-700'
                          : user.type === 'EMPLOYEE'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.type || 'MEMBER'}
                      </span>
                    </td>

                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.is_active !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {user.is_active !== false ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForDetail(user)}
                          className="px-2 py-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-[11px] flex items-center gap-1 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedUserForReset(user)}
                          className="px-2 py-1 rounded text-purple-700 hover:bg-purple-50 font-medium text-[11px] flex items-center gap-1 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                          <span>Reset</span>
                        </button>

                        {user.is_active !== false && (
                          <button
                            type="button"
                            onClick={() => setSelectedUserForDeactivate(user)}
                            className="px-2 py-1 rounded text-rose-700 hover:bg-rose-50 font-medium text-[11px] flex items-center gap-1 transition-colors"
                            title="Deactivate User"
                          >
                            <UserX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Deactivate</span>
                          </button>
                        )}

                        {onPingIntern && (
                          <button
                            type="button"
                            onClick={() => onPingIntern(user)}
                            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Direct Message"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provisioning Modals */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCreatedSuccess}
      />

      <CredentialModal
        isOpen={!!credentialModalData}
        data={credentialModalData}
        onClose={() => setCredentialModalData(null)}
      />

      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={handleBulkSuccess}
      />

      {/* User Management Modals */}
      <UserDetailModal
        isOpen={!!selectedUserForDetail}
        user={selectedUserForDetail}
        onClose={() => setSelectedUserForDetail(null)}
        onOpenResetPassword={(u) => setSelectedUserForReset(u)}
        onOpenDeactivate={(u) => setSelectedUserForDeactivate(u)}
      />

      <ResetPasswordModal
        isOpen={!!selectedUserForReset}
        user={selectedUserForReset}
        onClose={() => setSelectedUserForReset(null)}
        onSuccess={fetchUsers}
      />

      <DeactivateUserModal
        isOpen={!!selectedUserForDeactivate}
        user={selectedUserForDeactivate}
        onClose={() => setSelectedUserForDeactivate(null)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
