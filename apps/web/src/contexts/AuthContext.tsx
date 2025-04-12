'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

interface User {
  id: string | null;
  email: string | null;
  role: string | null;
}

// Extension of NextAuth Session to include custom properties
interface ExtendedSession {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  accessToken?: string;
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

/**
 * Internal AuthContext provider that depends on SessionProvider
 */
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>(emptyUser);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    // This is now a no-op as NextAuth handles session refresh
    // But we keep it for API compatibility
    return Promise.resolve();
  };

  // Update user when session changes
  useEffect(() => {
    setIsLoading(status === 'loading');

    if (status === 'authenticated' && session) {
      const extendedSession = session as unknown as ExtendedSession;
      setUser({
        id: extendedSession.user.id || null,
        email: extendedSession.user.email || null,
        role: extendedSession.user.role || null,
      });
    } else {
      setUser(emptyUser);
    }
  }, [session, status]);

  const contextValue = {
    isLoggedIn: status === 'authenticated',
    user,
    isLoading,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Main AuthProvider that includes both NextAuth's SessionProvider and our AuthContext
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const useUserRole = () => useAuth().user.role;
