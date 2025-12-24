import { useQuery } from '@tanstack/react-query';
import { getPatients, getPatientSummary } from '@/utils/get-patients';
import { getPatient } from '@/utils/update-patient';
import { queryKeys } from '@/lib/react-query/query-keys';

export function usePatients(page: number) {
  return useQuery({
    queryKey: queryKeys.patients.list(page),
    queryFn: () => getPatients(page),
  });
}

export function usePatientSummary(patientId: string) {
  return useQuery({
    queryKey: queryKeys.patients.summary(patientId),
    queryFn: () => getPatientSummary(patientId),
    enabled: !!patientId,
  });
}

export function usePatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.patients.detail(patientId),
    queryFn: () => getPatient(patientId),
    enabled: !!patientId,
  });
}
