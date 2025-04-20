import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, ChevronRight } from 'lucide-react';
import { Patient } from '@/types/patient';
import { ScheduleStatus } from '@/enums/schedule-status';
import { useRouter } from 'next/navigation';
import CalculateAge from '@/utils/calculate-age';
import { formatDate } from '@/utils/date-utils';
import { CopyableItem } from '../ui/copyable-item';

interface ViewPatientDialogProps {
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (isOpen: boolean) => void;
  selectedPatient: Patient;
}

export default function ViewPatientDialog({
  isViewDialogOpen,
  setIsViewDialogOpen,
  selectedPatient,
}: ViewPatientDialogProps) {
  const router = useRouter();

  const handleEditPatient = (patientId: string) => {
    setIsViewDialogOpen(false);
    router.push(`/patients/${patientId}`);
  };

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Detailed information about the patient.
          </DialogDescription>
        </DialogHeader>
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {selectedPatient.firstName} {selectedPatient.middleName}{' '}
                {selectedPatient.lastName}
              </h3>
              <Badge
                variant={
                  selectedPatient.scheduleStatus === ScheduleStatus.complete
                    ? 'default'
                    : 'outline'
                }
              >
                {
                  ScheduleStatus[
                    selectedPatient.scheduleStatus as keyof typeof ScheduleStatus
                  ]
                }
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CopyableItem
                label="Patient ID"
                value={selectedPatient.id}
                displayValue={
                  <span className="truncate w-20">#{selectedPatient.id}</span>
                }
                copyMessage="Patient ID copied to clipboard"
              />

              <CopyableItem
                label="Age"
                value={String(CalculateAge(selectedPatient.dateOfBirth))}
                copyMessage="Age copied to clipboard"
              />

              <CopyableItem
                label="Contact"
                value={selectedPatient.email}
                copyMessage="Email copied to clipboard"
              />

              <CopyableItem
                label="Date Registered"
                value={formatDate(selectedPatient.dateRegistered)}
                copyMessage="Date registered copied to clipboard"
              />
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Next Vaccination</p>
                  <p className="text-sm">next vaccination dates</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsViewDialogOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setIsViewDialogOpen(false);
              handleEditPatient(selectedPatient.id);
            }}
            className="w-full sm:w-auto"
          >
            More Details <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
