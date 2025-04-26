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
    administered: boolean;
    date?: Date;
  };
}
