import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/utils/get-users';
import { queryKeys } from '@/lib/react-query/query-keys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => getUsers(),
  });
}
