import { Exposure } from '@/types/exposure';
import { Schedule } from '@/types/schedule';
import { getSupabaseClient, throwOnSupabaseError } from './supabase';

function formatSchedule(
  schedule: Record<string, unknown>,
  exposure: Exposure
): Schedule {
  return {
    ...schedule,
    exposureId: exposure.id,
    patientId: exposure.patientId,
    exposure,
  } as Schedule;
}

export const getPatientSchedules = async (
  patientId: string
): Promise<Schedule[]> => {
  const supabase = getSupabaseClient();
  const { data: exposures, error: exposureError } = await supabase
    .from('exposures')
    .select('*')
    .eq('patientId', patientId)
    .order('createdAt', { ascending: false });
  throwOnSupabaseError(exposureError, 'Failed to fetch patient exposures');

  if (!exposures?.length) {
    return [];
  }

  const exposureById = new Map(
    exposures.map((exposure) => [exposure.id, exposure as Exposure])
  );
  const { data: schedules, error } = await supabase
    .from('schedules')
    .select('*')
    .in('exposureId', exposures.map((exposure) => exposure.id))
    .order('createdAt', { ascending: false });
  throwOnSupabaseError(error, 'Failed to fetch schedules');

  return (schedules || []).map((schedule) =>
    formatSchedule(schedule, exposureById.get(schedule.exposureId)!)
  );
};
