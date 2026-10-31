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

  // Helper to read current token from storage if available
  const getAuthHeader = (): Record<string, string> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch {
      // localStorage may fail in restricted environments
    }
    return {};
  };

  /**
   * Checks authentication status directly from the backend.
   * Completely independent from local storage state:
   * - Queries /api/auth/me immediately with credentials: 'include'.
   * - Supplies Bearer header if token exists in localStorage, but never requires it.
   * - Manages loading state cleanly with a guaranteed finally block.
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...getAuthHeader(),
      };

      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          // Sync token returned from backend to localStorage if present
          if (data.token) {
            try {
              localStorage.setItem(TOKEN_KEY, data.token);
            } catch {
              // Ignore storage errors in restricted contexts
            }
          }
          return true;
        }
      }

      // Backend session is not authenticated or expired
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // Ignore storage errors
      }
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch session status immediately upon app load
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      await checkAuth();
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
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
        try {
          localStorage.setItem(TOKEN_KEY, data.token);
        } catch {
          // Ignore storage errors
        }
      }
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // Ignore storage errors
      }
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
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
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}
