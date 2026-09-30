import React from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  FolderKanban, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Check, 
  X 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../services/userService';

export default function InternProfileTab({ onToast }) {
  const { user: authUser } = useAuth();
  const profile = userService.getCurrentUser();

  const displayName = authUser?.name || profile.name || 'Intern';
  const displayEmail = authUser?.email || profile.email || 'intern@dailoqa.com';
  const displayRole = authUser?.role || profile.role || 'INTERN';
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7C3AED&color=fff`;

  // Display user's actual permissions from auth token / session
  const userPermissions = authUser?.permissions || Object.keys(profile.permissions || {});

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={avatar}
          alt={displayName}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 w-fit mx-auto sm:mx-0">
              {displayRole}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{displayRole === 'INTERN' ? 'Engineering Intern' : displayRole}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {displayEmail}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Role: {displayRole}
            </span>
          </div>
        </div>
      </div>

      {/* Account Details & Cumulative Workstation Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" />
            <span>Account Details</span>
          </h3>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Account Name:</span>
              <span className="font-semibold text-slate-800">{displayName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Email Address:</span>
              <span className="font-semibold text-slate-800">{displayEmail}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="font-semibold text-slate-800">{displayRole}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Session Status:</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        {/* Workstation Performance Placeholder */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Performance Analytics</span>
              </h3>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                Planned for V2
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Individual workstation metrics, hours logged, and velocity benchmarks will be dynamically computed in the V2 Work Management and Attendance modules.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
            <span className="text-xs text-slate-400 font-medium">No recorded metrics for current session</span>
          </div>
        </div>
      </div>

      {/* API Permissions Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-600" />
            <span>Assigned API Privileges & Permissions</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicit access controls granted to your authenticated session in this organization
          </p>
        </div>

        {userPermissions.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
            Standard user permissions active.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {userPermissions.map((perm) => (
              <div
                key={perm}
                className="p-2.5 rounded-xl border bg-emerald-50/60 border-emerald-200 text-emerald-900 flex items-center justify-between text-xs"
              >
                <span className="font-mono text-[11px] font-semibold">{perm}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Granted
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
