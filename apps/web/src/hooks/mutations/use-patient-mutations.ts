import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPatient } from '@/utils/add-patient';
import { updatePatient } from '@/utils/update-patient';
import { queryKeys } from '@/lib/react-query/query-keys';
import { NewPatient, EditablePatient, Patient } from '@/types/patient';
import { toast } from '@/hooks/use-toast';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
  request: any;
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Patient>, Error, NewPatient>({
    mutationFn: (newPatient: NewPatient) => addPatient(newPatient),
    onSuccess: (data) => {
      // Invalidate patients list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.lists() });
      toast({
        title: 'Success',
        description: 'Patient created successfully',
      });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      updatedPatient,
    }: {
      patientId: string;
      updatedPatient: Partial<NewPatient>;
    }) => updatePatient(patientId, updatedPatient),
    onMutate: async ({ patientId, updatedPatient }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.patients.detail(patientId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.patients.summary(patientId),
      });

      // Snapshot the previous values
      const previousPatient = queryClient.getQueryData<EditablePatient>(
        queryKeys.patients.detail(patientId)
      );
      const previousSummary = queryClient.getQueryData(
        queryKeys.patients.summary(patientId)
      );

      // Optimistically update the cache
      if (previousPatient) {
        queryClient.setQueryData<EditablePatient>(
          queryKeys.patients.detail(patientId),
          {
            ...previousPatient,
            ...updatedPatient,
          }
        );
      }

      return { previousPatient, previousSummary };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPatient) {
        queryClient.setQueryData(
          queryKeys.patients.detail(variables.patientId),
          context.previousPatient
        );
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(
          queryKeys.patients.summary(variables.patientId),
          context.previousSummary
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.detail(variables.patientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.summary(variables.patientId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.lists() });
      toast({
        title: 'Success',
        description: 'Patient updated successfully',
      });
    },
  });
}
