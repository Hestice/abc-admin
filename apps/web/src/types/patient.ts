import { Sex, Category, Status } from '@abc-admin/enums';

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
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  address: string;
  email?: string;
  category: number;
  bodyPartsAffected: string;
  placeOfExposure: string;
  dateOfExposure: string;
  isExposureAtHome: boolean;
  sourceOfExposure: string;
  animalStatus: Status;
  isWoundCleaned: boolean;
  antiTetanusGiven: boolean;
  dateOfAntiTetanus?: string;
  briefHistory: string;
  allergy: string;
  medications: string;
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
  category: Category | number;
  bodyPartsAffected: string;
  placeOfExposure: string;
  dateOfExposure: Date | string;
  isExposureAtHome: boolean;
  sourceOfExposure: string;
  animalStatus: Status;
  isWoundCleaned: boolean;
  antiTetanusGiven: boolean;
  dateOfAntiTetanus?: Date | string;
  briefHistory: string;
  allergy: string;
  medications: string;
  scheduleStatus?: string;
  nextVaccinationDate?: Date | string;
  nextVaccinationDay?: string;
  dateRegistered?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
