import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function LoginView() {
  // Step state: 'PORTAL_SELECT' | 'ROOT_LOGIN' | 'ORG_SELECT' | 'ORG_LOGIN' | 'FORCE_CHANGE_PASSWORD'
  const [step, setStep] = useState('PORTAL_SELECT');
  
  // Credentials
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forced Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Organizations
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [orgSearch, setOrgSearch] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Status
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load organizations on demand
  const fetchOrganizations = async () => {
    try {
      setLoadingOrgs(true);
      setError('');
      const data = await authService.getOrganizations();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load organizations. Please check your connection.');
    } finally {
      setLoadingOrgs(false);
    }
  };

  const routeUserByRole = (role) => {
    if (role === 'SUPER_ADMIN') {
      navigate('/super-admin/dashboard');
    } else if (role === 'MANAGER') {
      navigate('/manager/dashboard');
    } else if (role === 'INTERN' || role === 'EMPLOYEE') {
      navigate('/intern/dashboard');
    } else {
      navigate('/unauthorized');
    }
  };

  const handleSelectPortalMode = (mode) => {
    setError('');
    setIdentifier('');
    setPassword('');
    if (mode === 'ROOT') {
      setStep('ROOT_LOGIN');
    } else {
      setStep('ORG_SELECT');
      if (organizations.length === 0) {
        fetchOrganizations();
      }
    }
  };

  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
    setError('');
    setIdentifier('');
    setPassword('');
    setStep('ORG_LOGIN');
  };

  const handleBack = () => {
    setError('');
    if (step === 'ROOT_LOGIN') {
      setStep('PORTAL_SELECT');
    } else if (step === 'ORG_SELECT') {
      setStep('PORTAL_SELECT');
    } else if (step === 'ORG_LOGIN') {
      setStep('ORG_SELECT');
    } else if (step === 'FORCE_CHANGE_PASSWORD') {
      setStep(selectedOrg ? 'ORG_LOGIN' : 'PORTAL_SELECT');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const orgId = step === 'ORG_LOGIN' ? selectedOrg?.id : null;

    try {
      const data = await login(identifier, password, orgId);
      const user = data?.user;

      // Check if newly provisioned user is required to set a permanent password
      if (user?.must_change_password) {
        setPendingUser(user);
        setCurrentPassword(password);
        setStep('FORCE_CHANGE_PASSWORD');
        return;
      }

      // Authoritative backend-determined role routing - NO role selection screen
      routeUserByRole(user?.role);
    } catch (err) {
      if (err.message?.toLowerCase().includes('failed to fetch') || err.message?.toLowerCase().includes('network error')) {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else {
        setError(err.message || 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from your temporary password.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      // Auto redirect according to role
      routeUserByRole(pendingUser?.role);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(orgSearch.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center font-sans selection:bg-[#7a3bff] selection:text-white bg-[#0a0518] relative overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Dynamic Cyberpunk Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #7a3bff 1px, transparent 1px), linear-gradient(to bottom, #7a3bff 1px, transparent 1px)`,
          backgroundSize: '3rem 3rem',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
        }}
      />

      {/* Massive Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#4c1d95] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-[#581c87] rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-[#7a3bff] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      
      {/* Neon Rings */}
      <div className="absolute top-[-30%] right-[-10%] w-[120%] h-[120%] rounded-[100%] border-[1px] border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.1)] opacity-60 pointer-events-none animate-[spin_60s_linear_infinite]" />
      <div className="absolute bottom-[-50%] right-[-20%] w-[150%] h-[150%] rounded-[100%] border-[2px] border-purple-400/20 shadow-[0_0_100px_rgba(124,58,237,0.2)] opacity-80 pointer-events-none animate-[spin_90s_linear_infinite_reverse]" />

      {/* Floating 3D Spheres */}
      <div className="absolute top-[15%] right-[25%] w-20 h-20 rounded-full bg-gradient-to-br from-[#d8b4fe] to-[#4c1d95] shadow-[0_0_40px_rgba(124,58,237,0.6)] animate-[bounce_5s_ease-in-out_infinite] backdrop-blur-md">
        <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px] w-8 h-8 top-2 left-2" />
      </div>
      <div className="absolute bottom-[25%] right-[35%] w-14 h-14 rounded-full bg-gradient-to-br from-[#c084fc] to-[#3b0764] shadow-[0_0_30px_rgba(124,58,237,0.5)] animate-[bounce_7s_ease-in-out_infinite] delay-1000">
        <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px] w-4 h-4 top-1 left-1" />
      </div>
      <div className="absolute top-[45%] left-[10%] w-10 h-10 rounded-full bg-gradient-to-br from-[#e9d5ff] to-[#6b21a8] shadow-[0_0_20px_rgba(124,58,237,0.4)] animate-[bounce_6s_ease-in-out_infinite] delay-500" />

      {/* MAIN CONTAINER */}
      <div className="flex w-full max-w-[1400px] mx-auto relative z-10 p-6 lg:p-12 h-full items-center">
        
        {/* LEFT SIDE: Card */}
        <div className="w-full lg:w-[48%] flex justify-center lg:justify-start z-20">
          
          <div className="w-full max-w-[500px] bg-[#110826]/75 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-purple-400/20 shadow-[0_0_50px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(124,58,237,0.1)] relative">
            
            {/* Top highlight bar */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 text-red-200 rounded-xl text-xs font-medium flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 1: PORTAL SELECTION                                   */}
            {/* ========================================================== */}
            {step === 'PORTAL_SELECT' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-900/60 text-purple-300 border border-purple-700/50">
                      Platform Portal
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight uppercase">
                    PROJECT MANAGEMENT SYSTEM
                  </h1>
                  <p className="text-sm font-bold text-purple-400 mt-1">
                    Sign In
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300/80 mt-2 leading-relaxed">
                    Select your access tier to sign in to the Project Management and Performance Tracking Platform.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* ROOT / SUPER ADMIN Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectPortalMode('ROOT')}
                    className="w-full text-left p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 to-indigo-950/40 border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-200 group-hover:scale-105 transition-transform shadow-inner">
                          <ShieldCheck className="w-6 h-6 text-purple-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                              Root / Super Admin
                            </h3>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
                              Global
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Global control plane &amp; organization tenant management
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                    </div>
                  </button>

                  {/* ORGANIZATION USER Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectPortalMode('ORG')}
                    className="w-full text-left p-5 rounded-2xl bg-gradient-to-r from-slate-900/60 to-purple-950/40 border border-slate-700/40 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-600/40 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform shadow-inner">
                          <Building2 className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                            Organization User
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Managers, interns, and employees belonging to an organization
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 2 (ROOT): ROOT LOGIN                                  */}
            {/* ========================================================== */}
            {step === 'ROOT_LOGIN' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-white mb-4 transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to portal selection
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest">
                      Root Control Plane
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-white mt-1 tracking-tight">
                    Root Login
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Sign in with your global Super Admin credentials.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email / User ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="superadmin@dailoqa.com"
                      autoFocus
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium transition-all shadow-inner text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium transition-all shadow-inner text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 flex justify-center items-center py-3.5 px-6 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.35)] text-xs font-bold text-white bg-gradient-to-r from-[#7a3bff] to-[#a35cff] hover:from-[#6d30ea] hover:to-[#9146f2] focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating Root...
                    </span>
                  ) : (
                    <span>Sign In to Root</span>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================== */}
            {/* STEP 2 (ORG): SELECT ORGANIZATION                          */}
            {/* ========================================================== */}
            {step === 'ORG_SELECT' && (
              <div className="space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-white mb-4 transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to portal selection
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Select Organization
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose your organization workspace to sign in.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                    placeholder="Search organizations..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium transition-all shadow-inner text-xs"
                  />
                </div>

                {/* Organization List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {loadingOrgs ? (
                    <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      <p className="text-xs">Loading available organizations...</p>
                    </div>
                  ) : filteredOrgs.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 bg-purple-950/20 rounded-2xl border border-purple-900/30 p-6">
                      <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
                      <p className="text-xs font-semibold text-slate-300">No organizations found</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {orgSearch ? `No matches for "${orgSearch}"` : 'No active organizations provisioned yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredOrgs.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => handleSelectOrg(org)}
                        className="w-full text-left p-4 rounded-xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-900/40 hover:border-purple-400/60 transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-800/40 border border-purple-600/40 flex items-center justify-center text-purple-200 font-bold text-xs group-hover:scale-105 transition-transform">
                            <Building2 className="w-4 h-4 text-purple-300" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white group-hover:text-purple-200 transition-colors block">
                              {org.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Workspace Tenant
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 3: ORGANIZATION LOGIN                                 */}
            {/* ========================================================== */}
            {step === 'ORG_LOGIN' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-white mb-4 transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to organization list
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40">
                      <Building2 className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest">
                      Tenant Workspace
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-white mt-1 tracking-tight">
                    {selectedOrg?.name || 'Organization'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Sign in with your organization credentials. Your role will be determined automatically.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email / User ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. manager@dailoqa.com or INT-1234"
                      autoFocus
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium transition-all shadow-inner text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium transition-all shadow-inner text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 flex justify-center items-center py-3.5 px-6 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.35)] text-xs font-bold text-white bg-gradient-to-r from-[#7a3bff] to-[#a35cff] hover:from-[#6d30ea] hover:to-[#9146f2] focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span>Sign In to {selectedOrg?.name}</span>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================== */}
            {/* STEP 4: FORCE PASSWORD CHANGE ON FIRST LOGIN               */}
            {/* ========================================================== */}
            {step === 'FORCE_CHANGE_PASSWORD' && (
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <KeyRound className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                      Security Setup
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Change Your Password
                  </h1>
                  <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                    Welcome, <strong>{pendingUser?.name}</strong>! As this is your first sign-in, please set your permanent password to continue.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Temporary Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter the temporary password provided"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0f0720] border border-purple-900/50 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full mt-3 flex justify-center items-center py-3.5 px-6 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.35)] text-xs font-bold text-white bg-gradient-to-r from-[#7a3bff] to-[#a35cff] hover:from-[#6d30ea] hover:to-[#9146f2] focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating Password...
                    </span>
                  ) : (
                    <span>Change Password &amp; Continue</span>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

        {/* RIGHT SIDE: Branding Graphic */}
        <div className="hidden lg:flex w-[52%] items-center justify-center relative pl-10 z-10">
          
          {/* Backlight Glow for the Logo */}
          <div className="absolute w-[40rem] h-[40rem] bg-gradient-to-r from-[#4c1d95]/40 to-[#a855f7]/40 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none" />
          
          {/* Main Logo Container with Floating Animation */}
          <div className="relative flex flex-col items-center animate-[bounce_4s_ease-in-out_infinite] text-center">
            <div className="text-[6.5rem] xl:text-[8rem] font-black tracking-tighter leading-none flex items-center justify-center relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <span className="text-white relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {selectedOrg ? selectedOrg.name.toUpperCase() : 'PMS'}
              </span>
            </div>
            
            <p className="text-purple-300 font-semibold text-sm tracking-wider uppercase mt-4">
              Project Management &amp; Performance Platform
            </p>

            {/* Minimalist Tech Lines Underneath */}
            <div className="mt-4 flex items-center gap-4 opacity-70">
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-white/40" />
              <div className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_10px_#a855f7]" />
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-white/40" />
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
