import React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';
import { Patient } from '@/types/patient';
import PatientInfoRow from './patient-info-row';

interface PatientsTableProps {
  filteredPatients: Patient[];
  handleViewPatient: (patient: Patient) => void;
}

export default function PatientsTable({
  filteredPatients,
  handleViewPatient,
}: PatientsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Next Vaccination</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPatients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No patients found
            </TableCell>
          </TableRow>
        ) : (
          filteredPatients.map((patient) => {
            return (
              <PatientInfoRow
                key={patient.id}
                patient={patient}
                handleViewPatient={handleViewPatient}
              />
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
