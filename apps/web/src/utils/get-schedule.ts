import { Exposure } from '@/types/exposure';
import { Schedule } from '@/types/schedule';
import { getPatientSchedules } from './get-patient-schedules';
import { ApiError, getSupabaseClient, throwOnSupabaseError } from './supabase';

export const getSchedule = async (
  patientId: string,
  scheduleId?: string
): Promise<Schedule> => {
  if (!scheduleId) {
    const schedules = await getPatientSchedules(patientId);
    if (!schedules.length) {
      throw new ApiError('No schedule found for patient', 404);
    }
    return schedules[0];
  }

  const supabase = getSupabaseClient();
  const { data: schedule, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', scheduleId)
    .single();
  throwOnSupabaseError(error, 'Schedule not found');

  const { data: exposure, error: exposureError } = await supabase
    .from('exposures')
    .select('*')
    .eq('id', schedule.exposureId)
    .single();
  throwOnSupabaseError(exposureError, 'Exposure not found');

  return {
    ...(schedule as Schedule),
    exposureId: exposure.id,
    patientId: exposure.patientId,
    exposure: exposure as Exposure,
  };
};
