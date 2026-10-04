import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-[#C5A059]/30 border-t-[#6B121C] animate-spin" />
          <div className="flex items-center gap-2">
            <span className="font-brand font-bold text-[#6B121C] text-lg tracking-wider">
              Balaji Mutton Shop
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#6B121C]/10 text-[#6B121C]">
              Admin Security
            </span>
          </div>
          <p className="text-xs text-[#5A504D]">Verifying encrypted admin session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Automatically redirect to the admin login page
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
