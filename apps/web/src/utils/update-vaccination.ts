import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { VaccinationDay } from '@/types/schedule';
import { ApiError } from './add-patient';

export const updateVaccination = async (
  patientId: string,
  scheduleId: string,
  vaccinationDay: VaccinationDay
): Promise<void> => {
  const { session } = await getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new ApiError(
      'No authentication token found. Please log in again.',
      401
    );
  }

  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
    accessToken: accessToken,
  });

  try {
    const schedulesApi = new SchedulesApi(config);
    await schedulesApi.schedulesControllerUpdateVaccination(scheduleId, {
      patientId,
      day: vaccinationDay,
    });
  } catch (error: any) {
    console.error('API connection failed:', error);
    if (error.response) {
      const status = error.response.status;
      let message = 'Failed to update vaccination schedule';
      if (status === 404) {
        message = 'Schedule not found.';
      } else if (status === 400) {
        message = 'Invalid vaccination data.';
      } else if (status === 401 || status === 403) {
        message = 'You are not authorized to perform this action.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }
      throw new ApiError(message, status);
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
};
