import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  FolderKanban, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Check, 
  X 
} from 'lucide-react';
import { userService } from '../services/userService';

export default function InternProfileTab({ onToast }) {
  const profile = userService.getCurrentUser();
  const permissionsList = Object.entries(profile.permissions || {});

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 w-fit mx-auto sm:mx-0">
              {profile.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{profile.title}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {profile.email}
            </span>
            <span className="flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
              {profile.primaryProjectName}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Lead: {profile.lead.name}
            </span>
          </div>
        </div>
      </div>

      {/* Intern Metadata & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Academic & Cohort Details</span>
          </h3>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Cohort Track:</span>
              <span className="font-semibold text-slate-800">{profile.cohort}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">University:</span>
              <span className="font-semibold text-slate-800">{profile.university}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Degree Program:</span>
              <span className="font-semibold text-slate-800">{profile.degree}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Internship Duration:</span>
              <span className="font-semibold text-slate-800">{profile.duration}</span>
            </div>
          </div>
        </div>

        {/* Lifetime Activity Stats */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Cumulative Workstation Performance</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center pt-2">
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Work Items Completed
              </span>
              <span className="text-xl font-extrabold text-purple-700">
                {profile.stats.tasksCompleted}
              </span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Hours Contributed
              </span>
              <span className="text-xl font-extrabold text-emerald-700">
                {profile.stats.hoursLogged}
              </span>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Attendance Rate
              </span>
              <span className="text-xl font-extrabold text-blue-700">
                {profile.stats.attendanceRate}
              </span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Forms Filed
              </span>
              <span className="text-xl font-extrabold text-amber-700">
                {profile.stats.formsSubmitted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* API Permissions Matrix (Requirement 16) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-600" />
            <span>Assigned API Privileges & Permissions</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicit access controls granted to your token for this organization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {permissionsList.map(([key, granted]) => (
            <div
              key={key}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                granted
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <span className="font-mono text-[11px] font-semibold">{key}</span>
              {granted ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Granted
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <X className="w-3.5 h-3.5 text-slate-400" /> Restricted
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
