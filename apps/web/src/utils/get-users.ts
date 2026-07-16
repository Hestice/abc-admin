import { Admin } from '@/types/admin';
import { getSupabaseClient, throwOnSupabaseError } from './supabase';

export const getUsers = async (): Promise<Admin[]> => {
  const { data, error } = await getSupabaseClient()
    .from('users')
    .select('id, email, role, isActive')
    .order('createdAt', { ascending: false });
  throwOnSupabaseError(error, 'Failed to fetch administrators');

  return (data || []).map((user) => ({
    id: user.id,
    username: '',
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  }));
};
