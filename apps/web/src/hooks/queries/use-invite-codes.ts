import { useQuery } from '@tanstack/react-query';
import { getInviteCodes, validateInviteCode } from '@/utils/invite-codes';
import { queryKeys } from '@/lib/react-query/query-keys';

export function useInviteCodes() {
  return useQuery({
    queryKey: queryKeys.inviteCodes.list(),
    queryFn: () => getInviteCodes(),
  });
}

export function useValidateInviteCode(code: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKeys.inviteCodes.all, 'validate', code],
    queryFn: () => validateInviteCode(code),
    enabled: enabled && !!code,
  });
}
