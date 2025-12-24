'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { getSession } from '@/lib/auth/client';
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
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuthStatus = async () => {
    try {
      const { session } = await getSession();

      if (session?.user && session.access_token) {
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
      // Only log unexpected errors, not JSON parsing or network errors
      if (
        error instanceof Error &&
        !error.message.includes('JSON') &&
        !error.message.includes('status')
      ) {
        console.error('Error checking auth status:', error);
      }
      setSupabaseUser(null);
      setAccessToken(null);
      setUser(emptyUser);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const consumePendingInviteCode = async (accessToken: string) => {
      try {
        const pendingCode = localStorage.getItem('pendingInviteCode');
        if (!pendingCode) {
          return;
        }

        // First validate the code to make sure it's still valid
        const { validateInviteCode, consumeInviteCode } = await import(
          '@/utils/invite-codes'
        );
        const validation = await validateInviteCode(pendingCode);

        if (!validation.valid) {
          // Remove invalid code from localStorage
          localStorage.removeItem('pendingInviteCode');
          return;
        }

        // Code is valid, try to consume it
        await consumeInviteCode(pendingCode);

        // Remove from localStorage after successful consumption
        localStorage.removeItem('pendingInviteCode');
      } catch (error) {
        console.error('Failed to consume pending invite code:', error);
        // If code was already consumed or doesn't exist, remove from localStorage
        if (error instanceof Error) {
          if (
            error.message.includes('already been used') ||
            error.message.includes('not found')
          ) {
            localStorage.removeItem('pendingInviteCode');
          }
        }
        // If it's a network error or auth error, keep it in localStorage to retry later
      }
    };

    const fetchUserFromBackend = async (accessToken: string) => {
      try {
        const { Configuration, UsersApi } = await import('@abc-admin/api-lib');
        const config = new Configuration({
          basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
          accessToken: accessToken,
        });
        const usersApi = new UsersApi(config);
        const response = await usersApi.usersControllerGetMe();
        const userData = response.data as any;

        // If user record was successfully created/fetched, consume pending invite code
        if (userData) {
          // Consume invite code if there's one pending
          // This will work whether the user was just created or already existed
          await consumePendingInviteCode(accessToken);
        }

        return userData;
      } catch (error) {
        console.error('Error fetching user from backend:', error);
        return null;
      }
    };

    const updateAuthState = async (
      session: { user: SupabaseUser; access_token: string } | null
    ) => {
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
          // Even if user data fetch failed, try to consume invite code if user is authenticated
          // This handles edge cases where the user record might already exist
          if (session.access_token) {
            await consumePendingInviteCode(session.access_token);
          }
        }
      } else {
        setSupabaseUser(null);
        setAccessToken(null);
        setUser(emptyUser);
      }
      setIsLoading(false);
    };

    const initializeAuth = async () => {
      try {
        const { session } = await getSession();

        if (!mounted) return;

        if (session?.user && session.access_token) {
          await updateAuthState({
            user: session.user,
            access_token: session.access_token,
          });
        } else {
          await updateAuthState(null);
        }
      } catch (error) {
        // Silently handle auth errors - user is just not logged in
        // Only log if it's not a network/JSON parsing error
        if (
          error instanceof Error &&
          !error.message.includes('JSON') &&
          !error.message.includes('status')
        ) {
          console.error('Error initializing auth:', error);
        }
        if (mounted) {
          await updateAuthState(null);
        }
      }
    };

    initializeAuth();

    // Poll for auth state changes (replaces onAuthStateChange)
    // Poll every 10 seconds, or on window focus/visibility change
    const pollAuthState = async () => {
      if (!mounted) return;
      try {
        const { session } = await getSession();
        if (session?.user && session.access_token) {
          await updateAuthState({
            user: session.user,
            access_token: session.access_token,
          });
        } else {
          await updateAuthState(null);
        }
      } catch (error) {
        // Silently handle polling errors - don't spam console
        // Only update state if we get a clear "not authenticated" signal
        if (error instanceof Error && error.message.includes('401')) {
          // Clear auth state on 401 (unauthorized)
          if (mounted) {
            await updateAuthState(null);
          }
        }
        // Don't log JSON parsing errors or network errors during polling
      }
    };

    // Set up polling interval - reduced frequency to reduce load
    // Poll every 30 seconds instead of 10
    pollingIntervalRef.current = setInterval(pollAuthState, 30000); // Poll every 30 seconds

    // Also poll on window focus and visibility change
    const handleFocus = () => {
      pollAuthState();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        pollAuthState();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
