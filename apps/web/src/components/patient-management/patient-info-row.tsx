import React from 'react';
import { TableCell } from '../ui/table';
import { TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScheduleStatus } from '@/enums/schedule-status';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { TooltipContent } from '../ui/tooltip';
import { TooltipTrigger } from '../ui/tooltip';
import { Tooltip } from '../ui/tooltip';
import { TooltipProvider } from '../ui/tooltip';
interface PatientInfoRowProps {
  patient: Patient;
  handleViewPatient: (patient: Patient) => void;
}

export default function PatientInfoRow({
  patient,
  handleViewPatient,
}: PatientInfoRowProps) {
  const patientName = `${patient?.lastName}, ${patient?.firstName} ${
    patient?.middleName ? patient?.middleName.charAt(0) + '.' : ''
  }`;

  const nextVaccinationDate = new Date(
    patient?.nextVaccinationDate
  ).toLocaleDateString();

  const formattedDate = format(nextVaccinationDate, 'PPP');
  const dayOfWeek = format(new Date(patient?.nextVaccinationDate), 'EEEE');

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
      <TableCell className="cursor-pointer">
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {patient.nextVaccinationDay}:
                </span>
                <span>{formattedDate}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{dayOfWeek}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right">
        <Button
          className="group"
          variant="ghost"
          size="sm"
          onClick={() => handleViewPatient(patient)}
        >
          <Eye className="h-4 w-4 mr-1" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
