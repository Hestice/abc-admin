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
  // Check if response has content before trying to parse JSON
  const contentType = response.headers.get('content-type');
  const text = await response.text();

  // If response is empty, handle it gracefully
  if (!text || text.trim().length === 0) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    // Return empty object for successful empty responses
    return {} as T;
  }

  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${text}`);
    }
    throw new Error('Response is not JSON');
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${text}`);
    }
    throw new Error(
      `Failed to parse JSON response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }

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
