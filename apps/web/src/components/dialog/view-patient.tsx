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
    console.log('go to patients/', patientId);
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
                {selectedPatient.scheduleStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Patient ID
                </p>
                <p>{selectedPatient.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p>age</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Contact
                </p>
                <p>contact</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Date Registered
                </p>
                <p>date registered</p>
              </div>
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
