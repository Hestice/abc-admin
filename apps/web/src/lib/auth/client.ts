import type { User, Session } from '@supabase/supabase-js';

interface ApiError {
  error: {
    message: string;
    status?: number;
  };
}

interface SessionResponse {
  session: Session | null;
  user: User | null;
}

interface SignInResponse {
  user: User;
  session: Session | null;
}

interface SignUpResponse {
  user: User;
  session: Session | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error = (data as ApiError).error || {
      message: 'An error occurred',
      status: response.status,
    };
    throw new Error(error.message);
  }

  return data as T;
}

export async function getSession(): Promise<SessionResponse> {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
    credentials: 'include',
  });

  return handleResponse<SessionResponse>(response);
}

export async function getUser(): Promise<{ user: User | null }> {
  const response = await fetch('/api/auth/user', {
    method: 'GET',
    credentials: 'include',
  });

  return handleResponse<{ user: User | null }>(response);
}

export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  return handleResponse<SignInResponse>(response);
}

export async function signUp(
  email: string,
  password: string,
  options?: { emailRedirectTo?: string }
): Promise<SignUpResponse> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password, options }),
  });

  return handleResponse<SignUpResponse>(response);
}

export async function signOut(): Promise<{ success: boolean }> {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
    credentials: 'include',
  });

  return handleResponse<{ success: boolean }>(response);
}
