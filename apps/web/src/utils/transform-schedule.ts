import { Schedule, VaccinationDay } from '@/types/schedule';
import { PatientVaccination } from '@/types/vaccinations';
import { getPatientName } from '@/utils/patient-utils';
import { Patient } from '@/types/patient';

export function transformScheduleData(
  scheduleResponse: Schedule,
  patientFirstName: string = 'Patient',
  patientMiddleName: string = '',
  patientLastName: string = '',
  antiTetanusGiven: boolean = false,
  dateOfAntiTetanus: Date = new Date()
): PatientVaccination {
  return {
    id: scheduleResponse.id,
    patientId: scheduleResponse.patientId,
    patientName: getPatientName({
      firstName: patientFirstName,
      middleName: patientMiddleName,
      lastName: patientLastName,
    } as Partial<Patient> as Patient),
    exposureDate: new Date(scheduleResponse.day0Date),
    vaccinations: [
      {
        day: 0,
        label: 'First Dose',
        date: new Date(scheduleResponse.day0Date),
        completed: scheduleResponse.day0Completed,
        completedDate: scheduleResponse.day0CompletedAt
          ? new Date(scheduleResponse.day0CompletedAt)
          : undefined,
      },
      {
        day: 3,
        label: 'Second Dose',
        date: new Date(scheduleResponse.day3Date),
        completed: scheduleResponse.day3Completed,
        completedDate: scheduleResponse.day3CompletedAt
          ? new Date(scheduleResponse.day3CompletedAt)
          : undefined,
      },
      {
        day: 7,
        label: 'Third Dose',
        date: new Date(scheduleResponse.day7Date),
        completed: scheduleResponse.day7Completed,
        completedDate: scheduleResponse.day7CompletedAt
          ? new Date(scheduleResponse.day7CompletedAt)
          : undefined,
      },
      {
        day: 28,
        label: 'Fourth Dose',
        date: new Date(scheduleResponse.day28Date),
        completed: scheduleResponse.day28Completed,
        completedDate: scheduleResponse.day28CompletedAt
          ? new Date(scheduleResponse.day28CompletedAt)
          : undefined,
        optional: true,
      },
    ],
    antiTetanus: {
      administered: antiTetanusGiven,
      date: dateOfAntiTetanus,
    },
  };
}

/**
 * Maps a day number to the corresponding VaccinationDay enum
 */
export function mapDayToVaccinationDay(day: number): VaccinationDay {
  switch (day) {
    case 0:
      return VaccinationDay.DAY_0;
    case 3:
      return VaccinationDay.DAY_3;
    case 7:
      return VaccinationDay.DAY_7;
    case 28:
      return VaccinationDay.DAY_28;
    default:
      throw new Error(`Invalid vaccination day: ${day}`);
  }
}

/**
 * Gets information about the next upcoming vaccination
 */
export function getNextVaccinationInfo(patientVaccination: PatientVaccination) {
  const nextVaccination = patientVaccination.vaccinations.find(
    (v) => !v.completed && !v.optional
  );

  if (!nextVaccination) return null;

  return {
    day: nextVaccination.day,
    date: nextVaccination.date,
  };
}
