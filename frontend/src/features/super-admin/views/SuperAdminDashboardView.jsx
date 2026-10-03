import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  FolderKanban, 
  FileText, 
  Plus, 
  Search, 
  Loader2, 
  ShieldCheck, 
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { organizationService } from '../../../services/organization.service';
import CreateOrganizationModal from '../components/CreateOrganizationModal';

export default function SuperAdminDashboardView() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrgDetails, setSelectedOrgDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await organizationService.getOrganizations();
      setOrganizations(data);
    } catch (err) {
      console.error('Failed to load organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleViewDetails = async (orgId) => {
    try {
      setLoadingDetails(true);
      const details = await organizationService.getOrganizationById(orgId);
      setSelectedOrgDetails(details);
    } catch (e) {
      console.error('Failed to fetch org details:', e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const q = search.toLowerCase();
    return (
      org.name.toLowerCase().includes(q) ||
      org.managers?.some((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    );
  });

  const totalUsers = organizations.reduce((acc, curr) => acc + (curr.stats?.user_count || 0), 0);
  const totalProjects = organizations.reduce((acc, curr) => acc + (curr.stats?.project_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 tracking-wider uppercase">
              Platform Administration
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Tenant Organizations Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Provision new client organizations and monitor overall platform tenant activity
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Organization</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Organizations</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{organizations.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Provisioned Users</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Active Tenant Projects</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalProjects}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations or managers..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-800 placeholder:text-slate-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            <span className="text-xs font-medium">Loading platform organizations...</span>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No Organizations Found</p>
            <p className="text-xs text-slate-400 mt-0.5">Click "Provision Organization" to create the first tenant</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold tracking-wider uppercase text-[10px]">
                  <th className="py-3 px-5">Organization Name</th>
                  <th className="py-3 px-4">Primary Manager</th>
                  <th className="py-3 px-4">Users</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Work Items</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrgs.map((org) => {
                  const primaryMgr = org.managers?.[0];
                  return (
                    <tr key={org.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                            {org.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="block text-slate-900 font-bold">{org.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{org.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {primaryMgr ? (
                          <div>
                            <span className="font-semibold text-slate-800 block">{primaryMgr.name}</span>
                            <span className="text-[11px] text-purple-700">{primaryMgr.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No manager assigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono text-[11px]">
                          {org.stats?.user_count || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono text-[11px]">
                          {org.stats?.project_count || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono text-[11px]">
                          {org.stats?.work_item_count || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(org.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleViewDetails(org.id)}
                          className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Slide-Over / Modal */}
      {selectedOrgDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedOrgDetails.name}</h3>
                <p className="text-xs text-slate-400 font-mono">Org ID: {selectedOrgDetails.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrgDetails(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Users</p>
                <p className="text-base font-black text-slate-800 mt-0.5">{selectedOrgDetails.stats?.user_count}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Projects</p>
                <p className="text-base font-black text-slate-800 mt-0.5">{selectedOrgDetails.stats?.project_count}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Work Items</p>
                <p className="text-base font-black text-slate-800 mt-0.5">{selectedOrgDetails.stats?.work_item_count}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Forms</p>
                <p className="text-base font-black text-slate-800 mt-0.5">{selectedOrgDetails.stats?.form_count}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Members ({selectedOrgDetails.users?.length || 0})</h4>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {selectedOrgDetails.users?.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block">{u.name}</span>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">
                        {u.role}
                      </span>
                      {u.user_code && (
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-mono">
                          {u.user_code}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrgDetails(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      <CreateOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchOrganizations();
        }}
      />
    </div>
  );
}
