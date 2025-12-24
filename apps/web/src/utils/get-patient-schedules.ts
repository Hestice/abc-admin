import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { Schedule } from '@/types/schedule';
import { ScheduleStatus } from '@/enums/schedule-status';
import { ApiError } from './add-patient';

export const getPatientSchedules = async (
  patientId: string
): Promise<Schedule[]> => {
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
};
