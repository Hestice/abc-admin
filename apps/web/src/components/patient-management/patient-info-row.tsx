import React from 'react';
import { TableCell } from '../ui/table';
import { TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Patient } from '@/types/patient';
import { TooltipContent } from '../ui/tooltip';
import { TooltipTrigger } from '../ui/tooltip';
import { Tooltip } from '../ui/tooltip';
import { TooltipProvider } from '../ui/tooltip';
import {
  getFormattedVaccinationDate,
  getVaccinationDayOfWeek,
} from '@/utils/patient-utils';
import { getScheduleStatus } from '@/utils/patient-utils';
import { isVaccinationCompleted } from '@/utils/patient-utils';
import { getPatientName } from '@/utils/patient-utils';
interface PatientInfoRowProps {
  patient: Patient;
  handleViewPatient: (patient: Patient) => void;
}

export default function PatientInfoRow({
  patient,
  handleViewPatient,
}: PatientInfoRowProps) {
  const patientName = getPatientName(patient);

  return (
    <TableRow key={patient.id}>
      <TableCell>
        <div className="font-medium">{patientName}</div>
        <div className="text-xs text-muted-foreground">#{patient.id}</div>
      </TableCell>
      <TableCell>
        <Badge
          variant={isVaccinationCompleted(patient) ? 'default' : 'outline'}
        >
          {getScheduleStatus(patient)}
        </Badge>
      </TableCell>
      <TableCell className="cursor-pointer">
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger asChild>
              {!isVaccinationCompleted(patient) && (
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {patient.nextVaccinationDay}:
                  </span>
                  <span>{getFormattedVaccinationDate(patient)}</span>
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent>{getVaccinationDayOfWeek(patient)}</TooltipContent>
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
