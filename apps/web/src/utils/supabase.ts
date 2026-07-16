import { createClient } from '@/lib/supabase/client';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getSupabaseClient() {
  return createClient();
}

export function throwOnSupabaseError(
  error: { message: string; code?: string } | null,
  fallback: string
): never | void {
  if (!error) {
    return;
  }

  const status = error.code === 'PGRST116' ? 404 : undefined;
  throw new ApiError(error.message || fallback, status);
}

export function response<T>(data: T) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {},
  };
}
