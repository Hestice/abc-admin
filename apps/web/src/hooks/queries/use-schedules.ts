import { useQuery } from '@tanstack/react-query';
import { getSchedule } from '@/utils/get-schedule';
import { getPatientSchedules } from '@/utils/get-patient-schedules';
import { queryKeys } from '@/lib/react-query/query-keys';

export function useSchedule(patientId: string, scheduleId?: string) {
  return useQuery({
    queryKey: scheduleId
      ? queryKeys.schedules.detail(scheduleId)
      : queryKeys.schedules.byPatientAndId(patientId, 'latest'),
    queryFn: () => getSchedule(patientId, scheduleId),
    enabled: !!patientId,
  });
}

export function usePatientSchedules(patientId: string) {
  return useQuery({
    queryKey: queryKeys.schedules.byPatient(patientId),
    queryFn: () => getPatientSchedules(patientId),
    enabled: !!patientId,
  });
}
