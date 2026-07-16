import { Patient, PatientSummary } from '@/types/patient';
import { ApiError, getSupabaseClient, throwOnSupabaseError } from './supabase';

export const getPatients = async (
  page: number
): Promise<{ patients: Patient[]; total: number }> => {
  const { data, error } = await getSupabaseClient().rpc(
    'list_patient_summaries',
    { p_page: page, p_page_size: 10 }
  );
  throwOnSupabaseError(error, 'Failed to fetch patients');

  const result = data as { patients?: Patient[]; total?: number } | null;
  return {
    patients: result?.patients || [],
    total: result?.total || 0,
  };
};

export const getPatientSummary = async (
  patientId: string
): Promise<{ patient: PatientSummary | null }> => {
  const { data, error } = await getSupabaseClient().rpc('patient_summary', {
    p_patient_id: patientId,
  });
  throwOnSupabaseError(error, 'Failed to fetch patient summary');
  if (!data) {
    throw new ApiError('Patient not found', 404);
  }
  return { patient: data as PatientSummary };
};
