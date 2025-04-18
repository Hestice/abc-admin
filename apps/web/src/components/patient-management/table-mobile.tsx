import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Patient } from '@/types/patient';
import { ScheduleStatus } from '@/enums/schedule-status';

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
            <Card key={patient.id} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  className="flex w-full items-center justify-between p-4 text-left"
                  onClick={() => handleViewPatient(patient)}
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {patient.firstName} {patient.middleName}{' '}
                      {patient.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{patient.id}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          patient.scheduleStatus === ScheduleStatus.complete
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {patient.scheduleStatus}
                      </Badge>
                      {patient.scheduleStatus ===
                        ScheduleStatus.in_progress && (
                        <div className="text-xs text-muted-foreground">
                          Next: {patient.nextVaccinationDay}
                          {patient.nextVaccinationDate &&
                            new Date(
                              patient.nextVaccinationDate
                            ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
