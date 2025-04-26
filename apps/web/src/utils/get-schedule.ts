import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Schedule } from '@/types/schedule';
import { ScheduleStatus } from '@/enums/schedule-status';

interface ExtendedSession extends Session {
  accessToken?: string;
}

interface GetScheduleConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
}

export const getSchedule = async ({
  setIsLoading,
  patientId,
}: GetScheduleConnectionProps): Promise<Schedule> => {
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
    const response = await schedulesApi.schedulesControllerFindByPatientId(
      patientId
    );

    const {
      day0CompletedAt,
      day3CompletedAt,
      day7CompletedAt,
      day28CompletedAt,
      ...rest
    } = response.data;

    return {
      ...rest,
      patientId,
      status:
        response.data.status === ScheduleStatus.completed
          ? ScheduleStatus.completed
          : ScheduleStatus.in_progress,
      day0CompletedAt: day0CompletedAt || undefined,
      day3CompletedAt: day3CompletedAt || undefined,
      day7CompletedAt: day7CompletedAt || undefined,
      day28CompletedAt: day28CompletedAt || undefined,
    };
  } catch (error) {
    console.error('API connection failed:', error);
    throw new Error(
      `Failed to get schedule: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  } finally {
    setIsLoading(false);
  }
};
