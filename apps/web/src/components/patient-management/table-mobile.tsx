import React from 'react';
import { Patient } from '@/types/patient';
import PatientCardMobile from './patient-card-mobile';
interface PatientTableMobileProps {
  filteredPatients: Patient[];
  handleViewPatient: (patient: Patient) => void;
}

export default function PatientTableMobile({
  filteredPatients,
  handleViewPatient,
}: PatientTableMobileProps) {
  return (
    <>
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="rounded-md border p-4 text-center">
            No patients found
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCardMobile
              key={patient.id}
              patient={patient}
              handleViewPatient={handleViewPatient}
            />
          ))
        )}
      </div>
    </>
  );
}
