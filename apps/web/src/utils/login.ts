import { signIn, signOut } from 'next-auth/react';

export interface LoginResponse {
  user: {
    username?: string;
    id?: string;
    role?: string;
  };
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(
        result.error === 'CredentialsSignin'
          ? 'Invalid credentials'
          : result.error
      );
    }

    return { user: { username } };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function isAuthenticated() {
  // This will be managed by the useSession hook from next-auth/react
  // This function can be kept for compatibility, but should use the session state
  return false; // Placeholder - use useSession in components instead
}
