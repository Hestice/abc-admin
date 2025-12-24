import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInviteCode, consumeInviteCode } from '@/utils/invite-codes';
import { queryKeys } from '@/lib/react-query/query-keys';
import { toast } from '@/hooks/use-toast';

export function useCreateInviteCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createInviteCode(),
    onSuccess: () => {
      // Invalidate invite codes list
      queryClient.invalidateQueries({
        queryKey: queryKeys.inviteCodes.list(),
      });
      toast({
        title: 'Success',
        description: 'Invite code created successfully',
      });
    },
  });
}

export function useConsumeInviteCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => consumeInviteCode(code),
    onSuccess: () => {
      // Invalidate invite codes list
      queryClient.invalidateQueries({
        queryKey: queryKeys.inviteCodes.list(),
      });
      toast({
        title: 'Success',
        description: 'Invite code consumed successfully',
      });
    },
  });
}
