import { ApiError, getSupabaseClient, throwOnSupabaseError } from './supabase';

export { ApiError } from './supabase';

export async function createInviteCode() {
  const { data, error } = await getSupabaseClient().rpc('create_invite_code');
  throwOnSupabaseError(error, 'Failed to create invite code');
  return data;
}

export async function getInviteCodes() {
  const { data, error } = await getSupabaseClient()
    .from('invite_codes')
    .select('*')
    .order('created_at', { ascending: false });
  throwOnSupabaseError(error, 'Failed to fetch invite codes');
  return data || [];
}

export async function validateInviteCode(code: string) {
  const { data, error } = await getSupabaseClient().rpc(
    'validate_invite_code',
    { p_code: code }
  );
  if (error) {
    return { valid: false, message: 'Failed to validate invite code' };
  }
  return {
    valid: Boolean(data),
    message: data ? undefined : 'Invite code is invalid or has already been used',
  };
}

export async function consumeInviteCode(code: string) {
  const { data, error } = await getSupabaseClient().rpc(
    'redeem_invite_code',
    { p_code: code }
  );
  throwOnSupabaseError(error, 'Failed to consume invite code');
  if (!data) {
    throw new ApiError('Invite code could not be consumed');
  }
  return data;
}
