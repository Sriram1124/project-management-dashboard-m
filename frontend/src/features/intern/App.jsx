import React, { useState } from 'react';
import InternApp from './InternApp';
import LoginView from './auth/LoginView';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast({ msg });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] font-sans antialiased text-slate-800 selection:bg-purple-200">
      {!isAuthenticated ? (
        <LoginView
          onLogin={(role) => {
            setIsAuthenticated(true);
            triggerToast(`Signed in successfully as ${role === 'intern' ? 'Aarav Patel (Intern)' : 'Program Manager'}`);
          }}
        />
      ) : (
        <InternApp
          onLogout={() => {
            setIsAuthenticated(false);
            triggerToast('Signed out of workstation');
          }}
          onToast={triggerToast}
        />
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-slate-900 text-white text-xs font-medium shadow-md animate-in slide-in-from-bottom-2 duration-150 border border-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

