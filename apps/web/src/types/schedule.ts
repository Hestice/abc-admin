import { ScheduleStatus } from '@/enums/schedule-status';
import { Exposure } from './exposure';

export interface Schedule {
  id: string;
  exposureId: string;
  patientId?: string; // For backward compatibility, may be present via exposure.patient
  exposure?: Exposure; // Exposure data
  status: ScheduleStatus;
  day0Date: string;
  day3Date: string;
  day7Date: string;
  day28Date: string;
  day0Completed: boolean;
  day3Completed: boolean;
  day7Completed: boolean;
  day28Completed: boolean;
  day0CompletedAt?: string;
  day3CompletedAt?: string;
  day7CompletedAt?: string;
  day28CompletedAt?: string;
}

export enum VaccinationDay {
  DAY_0 = 0,
  DAY_3 = 3,
  DAY_7 = 7,
  DAY_28 = 28,
}
