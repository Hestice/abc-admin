import { Schedule } from '@/types/schedule';
import { getSupabaseClient, throwOnSupabaseError } from './supabase';

export async function createVaccinationSchedule(
  exposureId: string,
  startDate?: string
): Promise<Schedule> {
  const { data, error } = await getSupabaseClient().rpc(
    'create_vaccination_schedule',
    {
      p_exposure_id: exposureId,
      p_start_date: startDate ? startDate.slice(0, 10) : undefined,
    }
  );
  throwOnSupabaseError(error, 'Failed to create vaccination schedule');
  return data as Schedule;
}
