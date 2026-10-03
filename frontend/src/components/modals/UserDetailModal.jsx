import React from 'react';
import { X, User, KeyRound, UserX, Shield, Calendar, Mail, Hash, CheckCircle2, Clock } from 'lucide-react';

export default function UserDetailModal({
  isOpen,
  user,
  onClose,
  onOpenResetPassword,
  onOpenDeactivate
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-xs">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Member Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">Account profile &amp; security status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="font-semibold text-slate-600">Account Status</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              user.is_active !== false
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {user.is_active !== false ? '● Active' : '○ Inactive'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Name
              </span>
              <span className="font-bold text-slate-900">{user.name || '—'}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                User ID
              </span>
              <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {user.user_code || '—'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email
              </span>
              <span className="font-mono text-slate-700">{user.email}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Role / Type
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                user.type === 'INTERN'
                  ? 'bg-purple-100 text-purple-700'
                  : user.type === 'EMPLOYEE'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {user.type || 'MEMBER'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Created Date
              </span>
              <span className="text-slate-700">
                {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—'}
              </span>
            </div>

            {user.updated_at && (
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Last Updated
                </span>
                <span className="text-slate-700">
                  {new Date(user.updated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenResetPassword(user);
              }}
              className="px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-50 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Reset Password
            </button>

            {user.is_active !== false && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeactivate(user);
                }}
                className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <UserX className="w-3.5 h-3.5" />
                Deactivate
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
