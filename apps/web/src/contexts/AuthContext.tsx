'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { isAuthenticated } from '@/utils/login';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userRole: null,
  checkAuthStatus: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const checkAuthStatus = () => {
    // Check authentication status based on cookies
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    // Get user role from cookie
    if (loggedIn) {
      const cookies = document.cookie.split(';');
      const roleCookie = cookies.find((c) => c.trim().startsWith('user_role='));
      const role = roleCookie ? roleCookie.split('=')[1] : null;
      setUserRole(role);
    } else {
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
