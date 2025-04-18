import React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { Patient } from '@/types/patient';

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
          filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <div className="font-medium">{patient.name}</div>
                <div className="text-xs text-muted-foreground">
                  #{patient.id}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    patient.status === 'Complete' ? 'default' : 'outline'
                  }
                >
                  {patient.status}
                </Badge>
              </TableCell>
              <TableCell>{patient.nextVaccination}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewPatient(patient)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
