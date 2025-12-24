import { signIn, signOut } from '@/lib/auth/client';

export interface LoginResponse {
  user: {
    email?: string;
    id?: string;
    role?: string;
  };
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const { user } = await signIn(email, password);

    return { user: { email: user?.email, id: user?.id } };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function isAuthenticated() {
  // This function can be kept for compatibility, but should use useAuth hook instead
  return false; // Placeholder - use useAuth in components instead
}
