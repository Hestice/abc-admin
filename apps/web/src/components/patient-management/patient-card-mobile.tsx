import React from 'react';
import { CardContent } from '../ui/card';
import { Card } from '../ui/card';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScheduleStatus } from '@/enums/schedule-status';
import { Patient } from '@/types/patient';
import { getFormattedVaccinationDate } from '@/utils/patient-utils';
import { getScheduleStatus } from '@/utils/patient-utils';
import { getPatientName } from '@/utils/patient-utils';

interface PatientCardMobileProps {
  patient: Patient;
  handleViewPatient: (patient: Patient) => void;
}

export default function PatientCardMobile({
  patient,
  handleViewPatient,
}: PatientCardMobileProps) {
  const patientName = getPatientName(patient);
  const scheduleStatus = getScheduleStatus(patient);
  const formattedDate = getFormattedVaccinationDate(patient);

  return (
    <Card key={patient.id} className="overflow-hidden">
      <CardContent className="p-0">
        <button
          className="flex w-full items-center justify-between p-4 text-left"
          onClick={() => handleViewPatient(patient)}
        >
          <div className="flex-1 flex-col space-y-2">
            <h3 className="font-medium text-base">{patientName}</h3>

            <div className="flex flex-row">
              <div className="flex-1">
                <div className="mt-1">
                  <Badge
                    variant={
                      patient.scheduleStatus === ScheduleStatus.completed
                        ? 'default'
                        : 'outline'
                    }
                    className="px-2.5 py-0.5"
                  >
                    {scheduleStatus}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-end text-right pr-2">
                {patient.nextVaccinationDate && (
                  <span className="text-sm text-muted-foreground mb-1">
                    Next: {formattedDate}
                  </span>
                )}
                {scheduleStatus === ScheduleStatus.in_progress && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {patient.nextVaccinationDay}
                  </span>
                )}
              </div>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </button>
      </CardContent>
    </Card>
  );
}
