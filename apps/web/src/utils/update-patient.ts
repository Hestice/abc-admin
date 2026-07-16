import { EditablePatient, NewPatient } from '@/types/patient';
import { getSupabaseClient, throwOnSupabaseError } from './supabase';

function patientFields(patient: Partial<NewPatient>) {
  return Object.fromEntries(
    Object.entries({
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      sex: patient.sex,
      address: patient.address,
      email: patient.email,
    }).filter(([, value]) => value !== undefined)
  );
}

export const getPatient = async (
  patientId: string
): Promise<EditablePatient> => {
  const { data, error } = await getSupabaseClient()
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();
  throwOnSupabaseError(error, 'Patient not found');
  return data as EditablePatient;
};

export const updatePatient = async (
  patientId: string,
  updatedPatient: Partial<NewPatient>
): Promise<EditablePatient> => {
  const { data, error } = await getSupabaseClient()
    .from('patients')
    .update(patientFields(updatedPatient))
    .eq('id', patientId)
    .select()
    .single();
  throwOnSupabaseError(error, 'Failed to update patient');
  return data as EditablePatient;
};

export async function updatePatientAntiTetanus(): Promise<never> {
  throw new Error('Anti-tetanus is managed on the patient exposure.');
}
