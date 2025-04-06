'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getCurrentUser, verifyAuthentication } from '@/utils/auth';

interface User {
  id: string | null;
  email: string | null;
  role: string | null;
}
interface AuthContextType {
  isLoggedIn: boolean;
  user: User;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
}

const emptyUser: User = {
  id: null,
  email: null,
  role: null,
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: emptyUser,
  isLoading: true,
  checkAuthStatus: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(emptyUser);
  const [isLoading, setIsLoading] = useState(true);

  const clearUserData = () => setUser(emptyUser);

  const checkAuthStatus = async () => {
    setIsLoading(true);

    try {
      const isAuthenticated = await verifyAuthentication();
      setIsLoggedIn(isAuthenticated);

      if (isAuthenticated) {
        const profile = await getCurrentUser();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role,
          });
        } else {
          clearUserData();
        }
      } else {
        clearUserData();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsLoggedIn(false);
      clearUserData();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const contextValue = {
    isLoggedIn,
    user,
    isLoading,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const useUserRole = () => useAuth().user.role;
