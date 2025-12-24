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
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  // If response is empty, handle it gracefully
  if (!text || text.trim().length === 0) {
    if (!response.ok) {
      // Provide helpful error messages for common status codes
      const statusMessages: Record<number, string> = {
        405: 'Method not allowed. The requested endpoint does not support this HTTP method.',
        404: 'Endpoint not found. The requested resource does not exist.',
        500: 'Internal server error. Please try again later.',
        401: 'Unauthorized. Please check your credentials.',
        403: 'Forbidden. You do not have permission to access this resource.',
      };
      throw new Error(
        statusMessages[response.status] ||
          `Request failed with status ${response.status}`
      );
    }
    // Return empty object for successful empty responses
    return {} as T;
  }

  // For error responses, try to parse as JSON first, but fall back gracefully
  if (!response.ok) {
    // Try to parse as JSON first
    if (contentType.includes('application/json')) {
      try {
        const data = JSON.parse(text);
        const error = (data as ApiError).error || {
          message: 'An error occurred',
          status: response.status,
        };
        throw new Error(error.message);
      } catch (parseError) {
        // If JSON parsing fails, provide a helpful error message
        const statusMessages: Record<number, string> = {
          405: 'Method not allowed. The requested endpoint does not support this HTTP method.',
          404: 'Endpoint not found. The requested resource does not exist.',
          500: 'Internal server error. Please try again later.',
          401: 'Unauthorized. Please check your credentials.',
          403: 'Forbidden. You do not have permission to access this resource.',
        };
        throw new Error(
          statusMessages[response.status] ||
            `Request failed with status ${response.status}`
        );
      }
    } else {
      // For non-JSON error responses (like HTML error pages), provide a helpful message
      const statusMessages: Record<number, string> = {
        405: 'Method not allowed. The requested endpoint does not support this HTTP method.',
        404: 'Endpoint not found. The requested resource does not exist.',
        500: 'Internal server error. Please try again later.',
        401: 'Unauthorized. Please check your credentials.',
        403: 'Forbidden. You do not have permission to access this resource.',
      };
      throw new Error(
        statusMessages[response.status] ||
          `Request failed with status ${response.status}`
      );
    }
  }

  // For successful responses, they must be JSON
  // But also check if it looks like HTML (common for error pages)
  if (!contentType.includes('application/json')) {
    // If it looks like HTML, it's probably an error page even with 200 status
    if (text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
      throw new Error(
        `Received HTML response instead of JSON. This usually means the API endpoint doesn't exist or there's a routing issue.`
      );
    }
    throw new Error('Response is not JSON');
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
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
  // Use absolute URL to ensure we're hitting the API route, not the page
  const apiUrl = '/api/auth/signin';

  console.log('Signing in to:', apiUrl);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  console.log('Sign in response status:', response.status, response.url);

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
