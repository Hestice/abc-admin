import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { VaccinationDay } from '@/types/schedule';

interface ExtendedSession extends Session {
  accessToken?: string;
}

interface UpdateVaccinationConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
  scheduleId: string;
  vaccinationDay: VaccinationDay;
}

export const updateVaccination = async ({
  setIsLoading,
  patientId,
  scheduleId,
  vaccinationDay,
}: UpdateVaccinationConnectionProps): Promise<void> => {
  setIsLoading(true);

  try {
    const session = (await getSession()) as ExtendedSession | null;
    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      accessToken: accessToken,
    });

    const schedulesApi = new SchedulesApi(config);
    await schedulesApi.schedulesControllerUpdateVaccination(scheduleId, {
      patientId,
      day: vaccinationDay,
    });
  } catch (error) {
    console.error('API connection failed:', error);
    throw new Error(
      `Failed to update vaccination schedule: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  } finally {
    setIsLoading(false);
  }
};
