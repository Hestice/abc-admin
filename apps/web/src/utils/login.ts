import { redirect } from 'next/navigation';

interface LoginResponse {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { user: data.user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    
    redirect('/');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function isAuthenticated(): boolean {
  return document.cookie.includes('auth_token=');
}
