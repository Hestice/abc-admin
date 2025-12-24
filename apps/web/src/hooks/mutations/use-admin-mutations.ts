import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUser } from '@/utils/add-admin';
import { queryKeys } from '@/lib/react-query/query-keys';
import { NewAdmin } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAdmin: NewAdmin) => addUser(newAdmin),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      toast({
        title: 'Success',
        description: 'Admin created successfully',
      });
    },
  });
}
