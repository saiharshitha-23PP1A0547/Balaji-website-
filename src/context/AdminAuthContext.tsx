import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminUser {
  username: string;
  email: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_KEY = 'bms_admin_token';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeader(),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          setIsLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    }

    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    return false;
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      let data: any = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!data) {
        setIsLoading(false);
        return {
          success: false,
          error: `Server communication error (${res.status}). Please try again.`,
        };
      }

      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Invalid credentials' };
      }

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeader(),
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export function getAdminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
