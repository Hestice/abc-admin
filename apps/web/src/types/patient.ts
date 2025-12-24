import { Sex, Status } from '@abc-admin/enums';

export interface Patient {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  scheduleStatus: string;
  nextVaccinationDate: Date;
  nextVaccinationDay: string;
  dateOfBirth: Date;
  dateRegistered: Date;
  email: string | null;
  sex: Sex;
}

export interface PatientSummary {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  animalStatus: Status;
  antiTetanusGiven: boolean;
  dateOfAntiTetanus: Date;
  dateRegistered: Date;
  scheduleStatus: string;
  nextVaccinationDate: Date;
  nextVaccinationDay: string;
}

export interface NewPatient {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  address: string;
  email?: string;
}

export interface EditablePatient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: Date | string;
  sex: Sex | number;
  address: string;
  email: string | null;
  scheduleStatus?: string;
  nextVaccinationDate?: Date | string;
  nextVaccinationDay?: string;
  dateRegistered?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
