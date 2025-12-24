import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVaccination } from '@/utils/update-vaccination';
import { queryKeys } from '@/lib/react-query/query-keys';
import { VaccinationDay, Schedule } from '@/types/schedule';
import { toast } from '@/hooks/use-toast';

export function useUpdateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      scheduleId,
      vaccinationDay,
    }: {
      patientId: string;
      scheduleId: string;
      vaccinationDay: VaccinationDay;
    }) => updateVaccination(patientId, scheduleId, vaccinationDay),
    onMutate: async ({ scheduleId, vaccinationDay }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.schedules.detail(scheduleId),
      });

      // Snapshot the previous value
      const previousSchedule = queryClient.getQueryData<Schedule>(
        queryKeys.schedules.detail(scheduleId)
      );

      // Optimistically update the cache
      if (previousSchedule) {
        const updatedSchedule = { ...previousSchedule };
        // Update the appropriate day completion status
        if (vaccinationDay === 0) {
          updatedSchedule.day0Completed = true;
        } else if (vaccinationDay === 3) {
          updatedSchedule.day3Completed = true;
        } else if (vaccinationDay === 7) {
          updatedSchedule.day7Completed = true;
        } else if (vaccinationDay === 28) {
          updatedSchedule.day28Completed = true;
        }

        queryClient.setQueryData<Schedule>(
          queryKeys.schedules.detail(scheduleId),
          updatedSchedule
        );
      }

      return { previousSchedule };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousSchedule) {
        queryClient.setQueryData(
          queryKeys.schedules.detail(variables.scheduleId),
          context.previousSchedule
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate related schedule queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.detail(variables.scheduleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.byPatient(variables.patientId),
      });
      toast({
        title: 'Success',
        description: 'Vaccination status updated successfully',
      });
    },
  });
}
