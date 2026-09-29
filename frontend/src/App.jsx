import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';

import LoginView from './features/auth/LoginView';
import ManagerApp from './ManagerApp';
import InternApp from './features/intern/InternApp';

function AppRoutes() {
  const { logout } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      
      <Route 
        path="/manager/*" 
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerApp />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/intern/*" 
        element={
          <ProtectedRoute allowedRoles={['INTERN']}>
            <InternApp onLogout={logout} />
          </ProtectedRoute>
        } 
      />

      <Route path="/unauthorized" element={<div className="p-8 text-center text-xl text-red-600">Coming Soon / Unauthorized</div>} />
      
      {/* Catch all redirects to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
