import { Sex } from '@abc-admin/enums';

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

export interface NewPatient {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  sex: number;
  address: string;
  email?: string;
  category: number;
  bodyPartsAffected: string;
  placeOfExposure: string;
  dateOfExposure: string;
  isExposureAtHome: boolean;
  sourceOfExposure: string;
  isWoundCleaned: boolean;
  antiTetanusGiven: boolean;
  dateOfAntiTetanus?: string;
  briefHistory: string;
  allergy: string;
  medications: string;
}
