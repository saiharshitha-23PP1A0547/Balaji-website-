import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately to /admin
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = (location.state as any)?.from || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please provide both username/email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(username.trim(), password);

    if (result.success) {
      const from = (location.state as any)?.from || '/admin';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid admin credentials. Access denied.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between selection:bg-[#6B121C] selection:text-white">
      {/* Top Bar with return to public website */}
      <header className="p-4 sm:p-6 border-b border-[#E8E2D8] bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A504D] hover:text-[#6B121C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#8C7E7A]">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span className="font-medium">Encrypted Authentication</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6B121C] border-2 border-[#C5A059] shadow-md mb-4">
              <span className="font-serif font-bold text-2xl text-[#E5C88F]">B</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-brand font-bold text-[#1F1B1A] tracking-tight">
              Balaji Mutton Shop
            </h1>
            <p className="text-xs uppercase font-semibold tracking-widest text-[#C5A059] mt-1">
              Shop Management · Private Admin Portal
            </p>
            <p className="text-xs text-[#5A504D] mt-2">
              Authorized family shop proprietors and staff members only.
            </p>
          </div>

          {/* Login Form Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#E8E2D8] p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">Access Denied: </span>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#2D2726] uppercase tracking-wider mb-1.5">
                  Admin Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7E7A]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="e.g. admin or staff email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9D2C7] focus:outline-none focus:ring-2 focus:ring-[#6B121C] focus:border-transparent text-sm text-[#1F1B1A] placeholder-[#8C7E7A] transition-all bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2726] uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7E7A]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter private admin password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D9D2C7] focus:outline-none focus:ring-2 focus:ring-[#6B121C] focus:border-transparent text-sm text-[#1F1B1A] placeholder-[#8C7E7A] transition-all bg-[#FAF8F5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C7E7A] hover:text-[#1F1B1A]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#6B121C] hover:bg-[#4A0B10] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#E5C88F]" />
                    <span>Sign In to Admin Panel</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E8E2D8] text-center">
              <p className="text-[11px] text-[#8C7E7A] leading-relaxed">
                Protected by server-side PBKDF2 cryptographic password hashing and secure tokenized sessions.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#8C7E7A] border-t border-[#E8E2D8] bg-[#FAF8F5]">
        © {new Date().getFullYear()} Balaji Mutton Shop. All rights reserved. Private Administration.
      </footer>
    </div>
  );
};
