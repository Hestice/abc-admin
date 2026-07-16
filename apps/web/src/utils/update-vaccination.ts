import { VaccinationDay } from '@/types/schedule';
import { getSupabaseClient, throwOnSupabaseError } from './supabase';

export const updateVaccination = async (
  _patientId: string,
  scheduleId: string,
  vaccinationDay: VaccinationDay
): Promise<void> => {
  const { error } = await getSupabaseClient().rpc('toggle_vaccination', {
    p_schedule_id: scheduleId,
    p_day: vaccinationDay,
  });
  throwOnSupabaseError(error, 'Failed to update vaccination schedule');
};
