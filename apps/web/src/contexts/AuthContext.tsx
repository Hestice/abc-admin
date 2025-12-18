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
    let mounted = true;

    const fetchUserFromBackend = async (accessToken: string) => {
      try {
        const { Configuration, UsersApi } = await import('@abc-admin/api-lib');
        const config = new Configuration({
          basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
          accessToken: accessToken,
        });
        const usersApi = new UsersApi(config);
        const response = await usersApi.usersControllerGetMe();
        return response.data as any;
      } catch (error) {
        console.error('Error fetching user from backend:', error);
        return null;
      }
    };

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user && session.access_token) {
          setSupabaseUser(session.user);
          setAccessToken(session.access_token);

          // Call /me endpoint to ensure user exists in database and get role
          const userData = await fetchUserFromBackend(session.access_token);
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
            });
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || null,
              role: null,
            });
          }
        } else {
          setSupabaseUser(null);
          setAccessToken(null);
          setUser(emptyUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setSupabaseUser(null);
          setAccessToken(null);
          setUser(emptyUser);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user && session.access_token) {
        setSupabaseUser(session.user);
        setAccessToken(session.access_token);

        // Call /me endpoint to ensure user exists in database and get role
        const userData = await fetchUserFromBackend(session.access_token);
        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
          });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || null,
            role: null,
          });
        }
      } else {
        setSupabaseUser(null);
        setAccessToken(null);
        setUser(emptyUser);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
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
