import { Schedule, VaccinationDay } from '@/types/schedule';

// Define the vaccination schedule structure
export interface Vaccination {
  day: number;
  label: string;
  date: Date;
  completed: boolean;
  completedDate?: Date;
  optional?: boolean;
}

export interface PatientVaccination {
  id: string;
  patientId: string;
  patientName: string;
  exposureDate: Date;
  vaccinations: Vaccination[];
  antiTetanus: {
    required: boolean;
    administered: boolean;
    date?: Date;
  };
}

/**
 * Transforms raw schedule data from the API into a more usable structure
 * for the frontend components
 */
export function transformScheduleData(
  scheduleResponse: Schedule,
  patientName: string = 'Patient'
): PatientVaccination {
  return {
    id: scheduleResponse.id,
    patientId: scheduleResponse.patientId,
    patientName,
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
      required: true,
      administered: false, // This should come from API
      date: undefined,
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
