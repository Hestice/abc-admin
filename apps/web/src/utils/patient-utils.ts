import { Patient } from '@/types/patient';
import { ScheduleStatus } from '@/enums/schedule-status';
import { format } from 'date-fns';

export const getPatientName = (patient: Patient): string => {
  return `${patient.lastName}, ${patient.firstName} ${
    patient.middleName ? patient.middleName.charAt(0) + '.' : ''
  }`;
};

export const getNextVaccinationDate = (patient: Patient): Date | null => {
  return patient?.nextVaccinationDate
    ? new Date(patient.nextVaccinationDate)
    : null;
};

export const getFormattedVaccinationDate = (
  patient: Patient
): string | null => {
  const date = getNextVaccinationDate(patient);
  return date ? format(date, 'PPP') : null;
};

export const getVaccinationDayOfWeek = (patient: Patient): string | null => {
  const date = getNextVaccinationDate(patient);
  return date ? format(date, 'EEEE') : null;
};

export const getScheduleStatus = (patient: Patient): string => {
  return ScheduleStatus[patient.scheduleStatus as keyof typeof ScheduleStatus];
};

export const isVaccinationCompleted = (patient: Patient): boolean => {
  return getScheduleStatus(patient) === ScheduleStatus.completed;
};
