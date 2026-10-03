import React, { useState } from 'react';
import { X, User, Mail, ShieldAlert, Loader2, Sparkles, Building2, UserPlus, Info } from 'lucide-react';
import { usersService } from '../../services/users.service';

export default function AddMemberModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('INTERN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await usersService.createUser({
        name,
        email,
        type,
      });

      // Clear fields
      setName('');
      setEmail('');
      setType('INTERN');

      // Call parent onSuccess with created user and temporary credentials
      onSuccess(result);
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Add New Member</h2>
              <p className="text-xs text-slate-500 mt-0.5">Provision an Intern or Employee in your organization.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Member Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('INTERN')}
                className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                  type === 'INTERN'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Intern</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                      INT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Project task assignee</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  type === 'INTERN' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                }`}>
                  {type === 'INTERN' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType('EMPLOYEE')}
                className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                  type === 'EMPLOYEE'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Employee</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700">
                      EMP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Full team contributor</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  type === 'EMPLOYEE' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                }`}>
                  {type === 'EMPLOYEE' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>

          {/* Automated System Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-slate-600">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              The platform will automatically generate a human-readable <strong>User ID</strong> (<span className="font-mono text-slate-800">INT-xxxx</span> or <span className="font-mono text-slate-800">EMP-xxxx</span>) and a <strong>temporary password</strong>. The user will be prompted to set a permanent password upon first login.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating Member...
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
