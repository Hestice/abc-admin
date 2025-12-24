import { Category, Status } from '@abc-admin/enums';

export interface Exposure {
  id: string;
  patientId: string;
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface NewExposure {
  patientId: string;
  category: number;
  bodyPartsAffected: string;
  placeOfExposure: string;
  dateOfExposure: string;
  isExposureAtHome: boolean;
  sourceOfExposure: string;
  animalStatus?: Status;
  isWoundCleaned: boolean;
  antiTetanusGiven: boolean;
  dateOfAntiTetanus?: string;
  briefHistory: string;
  allergy: string;
  medications: string;
}

export interface EditableExposure {
  id: string;
  patientId: string;
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
