import React from 'react';
import { TableCell } from '../ui/table';
import { TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScheduleStatus } from '@/enums/schedule-status';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
interface PatientInfoRowProps {
  patient: Patient;
  handleViewPatient: (patient: Patient) => void;
}

export default function PatientInfoRow({
  patient,
  handleViewPatient,
}: PatientInfoRowProps) {
  const patientName = `${patient?.firstName} ${patient?.middleName.charAt(
    0
  )}. ${patient?.lastName}`;

  const nextVaccinationDate = new Date(
    patient?.nextVaccinationDate
  ).toLocaleDateString();

  const formattedDate = format(nextVaccinationDate, 'PPP');

  return (
    <TableRow key={patient.id}>
      <TableCell>
        <div className="font-medium">{patientName}</div>
        <div className="text-xs text-muted-foreground">#{patient.id}</div>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            patient.scheduleStatus === ScheduleStatus.complete
              ? 'default'
              : 'outline'
          }
        >
          {
            ScheduleStatus[
              patient.scheduleStatus as keyof typeof ScheduleStatus
            ]
          }
        </Badge>
      </TableCell>
      <TableCell className="space-x-2">
        <span className="text-xs text-muted-foreground">
          {patient.nextVaccinationDay}:
        </span>
        <span>{formattedDate}</span>
      </TableCell>
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
  );
}
