import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      
      if (data.user.role === 'MANAGER') {
        navigate('/manager/dashboard');
      } else if (data.user.role === 'INTERN') {
        navigate('/intern/dashboard');
      } else {
        navigate('/unauthorized');
      }
    } catch (err) {
      if (err.message.toLowerCase().includes('failed to fetch') || err.message.toLowerCase().includes('network error')) {
        setError('Cannot connect to the server. Please try again.');
      } else {
        setError('Invalid email or password. Please verify your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans selection:bg-[#7a3bff] selection:text-white bg-[#0a0518] relative overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* BACKGROUND ELEMENTS */}
      
      {/* Dynamic Cyberpunk Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #7a3bff 1px, transparent 1px), linear-gradient(to bottom, #7a3bff 1px, transparent 1px)`,
          backgroundSize: '3rem 3rem',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
        }}
      ></div>

      {/* Massive Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#4c1d95] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-[#581c87] rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-[#7a3bff] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Neon Rings / Arcs */}
      <div className="absolute top-[-30%] right-[-10%] w-[120%] h-[120%] rounded-[100%] border-[1px] border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.1)] opacity-60 pointer-events-none animate-[spin_60s_linear_infinite]"></div>
      <div className="absolute bottom-[-50%] right-[-20%] w-[150%] h-[150%] rounded-[100%] border-[2px] border-purple-400/20 shadow-[0_0_100px_rgba(124,58,237,0.2)] opacity-80 pointer-events-none animate-[spin_90s_linear_infinite_reverse]"></div>

      {/* Floating 3D Spheres with varying animations */}
      <div className="absolute top-[15%] right-[25%] w-20 h-20 rounded-full bg-gradient-to-br from-[#d8b4fe] to-[#4c1d95] shadow-[0_0_40px_rgba(124,58,237,0.6)] animate-[bounce_5s_ease-in-out_infinite] backdrop-blur-md">
        <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px] w-8 h-8 top-2 left-2"></div>
      </div>
      <div className="absolute bottom-[25%] right-[35%] w-14 h-14 rounded-full bg-gradient-to-br from-[#c084fc] to-[#3b0764] shadow-[0_0_30px_rgba(124,58,237,0.5)] animate-[bounce_7s_ease-in-out_infinite] delay-1000">
        <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px] w-4 h-4 top-1 left-1"></div>
      </div>
      <div className="absolute top-[45%] left-[10%] w-10 h-10 rounded-full bg-gradient-to-br from-[#e9d5ff] to-[#6b21a8] shadow-[0_0_20px_rgba(124,58,237,0.4)] animate-[bounce_6s_ease-in-out_infinite] delay-500"></div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex w-full max-w-[1400px] mx-auto relative z-10 p-6 lg:p-12 h-full items-center">
        
        {/* LEFT SIDE: Glassmorphism Login Card */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-start z-20">
          
          <div className="w-full max-w-[480px] bg-[#110826]/60 backdrop-blur-2xl p-10 rounded-2xl border border-purple-400/20 shadow-[0_0_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(124,58,237,0.1)] relative">
            
            {/* Subtle top edge highlight */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>

            <p className="text-[10px] font-bold tracking-[0.25em] text-purple-300 uppercase mb-4 opacity-80">
              Welcome Back
            </p>
            
            <h1 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
              Sign in to<br/>
              <span className="text-white">d</span><span className="text-[#a855f7]">ai</span><span className="text-white">loqa</span>
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed mb-8 opacity-80">
              Access your dashboard and be part of the next generation of AI-native financial services talent.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0f0720] border border-purple-900/40 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium transition-all shadow-inner text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#0f0720] border border-purple-900/40 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white placeholder-slate-500 font-medium transition-all shadow-inner text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-[#0f0720] border-purple-900/50 text-[#a855f7] focus:ring-[#a855f7] focus:ring-offset-[#110826]" defaultChecked />
                  <span className="text-xs font-medium text-slate-300">Keep me signed in</span>
                </label>
                <a href="#" className="text-xs font-semibold text-[#a855f7] hover:text-[#d8b4fe]">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 flex justify-between items-center py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] text-sm font-bold text-white bg-gradient-to-r from-[#7a3bff] to-[#a35cff] hover:from-[#6d30ea] hover:to-[#9146f2] focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:ring-offset-2 focus:ring-offset-[#110826] transition-all group border border-purple-400/30"
              >
                <span className="mx-auto flex items-center">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Sign in
                </span>
                {!isLoading && (
                  <svg className="w-4 h-4 absolute right-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-purple-900/30"></div>
                <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">OR</span>
                <div className="flex-1 border-t border-purple-900/30"></div>
              </div>

              <button
                type="button"
                className="w-full flex justify-center items-center space-x-3 py-3 px-4 rounded-xl border border-purple-900/40 bg-[#0f0720]/50 hover:bg-[#1a0f35] text-xs font-semibold text-slate-300 transition-colors shadow-inner"
              >
                <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span>Sign in with Microsoft</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: Massive "dailoqa" Graphic */}
        <div className="hidden lg:flex w-[55%] items-center justify-center relative pl-10 z-10">
          
          {/* Backlight Glow for the Logo */}
          <div className="absolute w-[40rem] h-[40rem] bg-gradient-to-r from-[#4c1d95]/40 to-[#a855f7]/40 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none"></div>
          
          {/* Main Logo Container with Floating Animation */}
          <div className="relative flex flex-col items-center animate-[bounce_4s_ease-in-out_infinite]">
            <div className="text-[10rem] font-black tracking-tighter leading-none flex items-center relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* Reflected Glare (Glass effect on top of text) */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent pointer-events-none -mt-4">
                d a i l o q a
              </div>

              <span className="text-white relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">d</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#c084fc] to-[#7e22ce] relative z-10 filter drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">ai</span>
              <span className="text-white relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">loqa</span>
            </div>
            
            {/* Minimalist Tech Lines Underneath */}
            <div className="mt-8 flex items-center gap-4 opacity-70">
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-white/40"></div>
              <div className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_10px_#a855f7]"></div>
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-white/40"></div>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
