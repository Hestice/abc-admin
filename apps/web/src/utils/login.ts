import { createClient } from '@/lib/supabase/client';

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
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Invalid credentials');
    }

    return { user: { email: data.user?.email, id: data.user?.id } };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function isAuthenticated() {
  // This function can be kept for compatibility, but should use useAuth hook instead
  return false; // Placeholder - use useAuth in components instead
}
