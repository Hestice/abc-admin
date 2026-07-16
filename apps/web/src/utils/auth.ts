import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', user.id)
    .single();
  if (error || !data) {
    return null;
  }
  return data as UserProfile;
}

export function isAdmin(userRole: string | null): boolean {
  return userRole === 'ADMIN';
}

export async function verifyAuthentication(): Promise<boolean> {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  return Boolean(user);
}
