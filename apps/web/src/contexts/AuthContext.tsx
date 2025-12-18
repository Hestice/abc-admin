'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
  supabaseUser: SupabaseUser | null;
  accessToken: string | null;
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
  supabaseUser: null,
  accessToken: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(emptyUser);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const checkAuthStatus = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setSupabaseUser(session.user);
        setAccessToken(session.access_token);
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          role: null, // Role will be fetched from backend if needed
        });
      } else {
        setSupabaseUser(null);
        setAccessToken(null);
        setUser(emptyUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setSupabaseUser(null);
      setAccessToken(null);
      setUser(emptyUser);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setAccessToken(session.access_token);
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          role: null, // Role will be fetched from backend if needed
        });
        setIsLoading(false);
      } else {
        setSupabaseUser(null);
        setAccessToken(null);
        setUser(emptyUser);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue = {
    isLoggedIn: !!supabaseUser,
    user,
    isLoading,
    checkAuthStatus,
    supabaseUser,
    accessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const useUserRole = () => useAuth().user.role;
