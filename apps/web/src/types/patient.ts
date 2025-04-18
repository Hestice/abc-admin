export interface Patient {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  scheduleStatus: string;
  nextVaccinationDate: Date;
  nextVaccinationDay: string;
}
