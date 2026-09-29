import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('manager'); // 'manager' | 'intern'
  const [email, setEmail] = useState('sarah.m@internhub.dev');
  const [password, setPassword] = useState('••••••••••••');

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    if (role === 'manager') {
      setEmail('sarah.m@internhub.dev');
    } else {
      setEmail('aarav.p@internhub.dev');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-center items-center p-4 select-none">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#4C1D95] border border-purple-400/30 flex items-center justify-center text-white font-bold text-lg tracking-wider mx-auto shadow-md">
            IH
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-3 tracking-tight">
            INTERN HUB WORKSPACE
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Intern Management & Performance Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Select Your Role & Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose an authentication perspective to enter the system
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Manager Option */}
            <div
              onClick={() => handleSelectRole('manager')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                selectedRole === 'manager'
                  ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                  alt="Sarah Mitchell"
                  className="w-11 h-11 rounded-full object-cover border-2 border-purple-200 shadow-2xs"
                />
                {selectedRole === 'manager' && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-[9px]">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 mt-2 block">
                Sarah Mitchell
              </span>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full mt-1">
                Program Manager
              </span>
            </div>

            {/* Intern Option */}
            <div
              onClick={() => handleSelectRole('intern')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                selectedRole === 'intern'
                  ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                  alt="Aarav Patel"
                  className="w-11 h-11 rounded-full object-cover border-2 border-purple-200 shadow-2xs"
                />
                {selectedRole === 'intern' && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-[9px]">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 mt-2 block">
                Aarav Patel
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                Engineering Intern
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  readOnly
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#4C1D95] hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] mt-2"
            >
              <span>
                {selectedRole === 'manager'
                  ? 'Sign In to Manager Console'
                  : 'Sign In to Intern Workstation'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          Demo Mode • Click either card to toggle login authentication credentials
        </p>
      </div>
    </div>
  );
}
