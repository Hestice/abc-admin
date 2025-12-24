import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { Schedule } from '@/types/schedule';
import { ScheduleStatus } from '@/enums/schedule-status';

interface GetPatientSchedulesProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
}

export const getPatientSchedules = async ({
  setIsLoading,
  patientId,
}: GetPatientSchedulesProps): Promise<Schedule[]> => {
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
    const response = await schedulesApi.schedulesControllerFindAllByPatientId(
      patientId
    );

    return (response.data as any[]).map((schedule: any) => {
      const {
        day0CompletedAt,
        day3CompletedAt,
        day7CompletedAt,
        day28CompletedAt,
        exposure,
        ...rest
      } = schedule;

      return {
        ...rest,
        exposureId: exposure?.id,
        patientId: exposure?.patient?.id || patientId,
        exposure: exposure,
        status:
          schedule.status === ScheduleStatus.completed
            ? ScheduleStatus.completed
            : ScheduleStatus.in_progress,
        day0CompletedAt: day0CompletedAt || undefined,
        day3CompletedAt: day3CompletedAt || undefined,
        day7CompletedAt: day7CompletedAt || undefined,
        day28CompletedAt: day28CompletedAt || undefined,
      };
    });
  } catch (error) {
    console.error('API connection failed:', error);
    throw new Error(
      `Failed to get patient schedules: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  } finally {
    setIsLoading(false);
  }
};
