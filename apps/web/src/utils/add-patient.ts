import { NewPatient, Patient } from '@/types/patient';
import { getSupabaseClient, response, throwOnSupabaseError } from './supabase';

export { ApiError } from './supabase';

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: Record<string, never>;
  request: Record<string, never>;
}

export const addPatient = async (
  newPatient: NewPatient
): Promise<ApiResponse<Patient>> => {
  const { data, error } = await getSupabaseClient()
    .from('patients')
    .insert({
      firstName: newPatient.firstName,
      middleName: newPatient.middleName || null,
      lastName: newPatient.lastName,
      dateOfBirth: newPatient.dateOfBirth,
      sex: newPatient.sex,
      address: newPatient.address,
      email: newPatient.email || null,
    })
    .select()
    .single();

  throwOnSupabaseError(error, 'Failed to create patient');
  return response(data as Patient);
};
