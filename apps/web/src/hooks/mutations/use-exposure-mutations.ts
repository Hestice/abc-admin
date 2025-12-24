import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExposure } from '@/utils/add-exposure';
import { queryKeys } from '@/lib/react-query/query-keys';
import { NewExposure, Exposure } from '@/types/exposure';
import { toast } from '@/hooks/use-toast';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
  request: any;
}

export function useCreateExposure() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Exposure>, Error, NewExposure>({
    mutationFn: (newExposure: NewExposure) => addExposure(newExposure),
    onSuccess: (data, variables) => {
      // Invalidate related patient and schedule queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.detail(variables.patientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.summary(variables.patientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byPatient(variables.patientId),
      });
      toast({
        title: 'Success',
        description: 'Exposure created successfully',
      });
    },
  });
}
