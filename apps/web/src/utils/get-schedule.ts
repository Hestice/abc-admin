import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { Schedule } from '@/types/schedule';
import { ScheduleStatus } from '@/enums/schedule-status';

interface GetScheduleConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
  scheduleId?: string;
}

export const getSchedule = async ({
  setIsLoading,
  patientId,
  scheduleId,
}: GetScheduleConnectionProps): Promise<Schedule> => {
  setIsLoading(true);

  try {
    const { session } = await getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      accessToken: accessToken,
    });

    const schedulesApi = new SchedulesApi(config);

    let response;
    if (scheduleId) {
      // Fetch by schedule ID
      response = await schedulesApi.schedulesControllerFindOne(scheduleId);
    } else {
      // Fetch by patient ID (returns most recent schedule for backward compatibility)
      const schedulesResponse =
        await schedulesApi.schedulesControllerFindAllByPatientId(patientId);
      if (!schedulesResponse.data || schedulesResponse.data.length === 0) {
        throw new Error('No schedule found for patient');
      }
      // Use the first schedule (most recent)
      response = { data: schedulesResponse.data[0] };
    }

    const {
      day0CompletedAt,
      day3CompletedAt,
      day7CompletedAt,
      day28CompletedAt,
      exposure,
      ...rest
    } = response.data as any;

    return {
      ...rest,
      exposureId: exposure?.id,
      patientId: exposure?.patient?.id || patientId,
      exposure: exposure,
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
