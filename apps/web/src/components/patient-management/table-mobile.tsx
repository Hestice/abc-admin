import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Patient } from '@/types/patient';

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
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      #{patient.id}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          patient.status === 'Complete' ? 'default' : 'outline'
                        }
                      >
                        {patient.status}
                      </Badge>
                      {patient.status === 'In Progress' && (
                        <div className="text-xs text-muted-foreground">
                          Next: {patient.nextVaccination}
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
