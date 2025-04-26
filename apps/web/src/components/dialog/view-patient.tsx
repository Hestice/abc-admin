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
import { Calendar, ChevronRight, Users } from 'lucide-react';
import { Patient } from '@/types/patient';
import { ScheduleStatus } from '@/enums/schedule-status';
import { useRouter } from 'next/navigation';
import CalculateAge from '@/utils/calculate-age';
import { formatDate } from '@/utils/date-utils';
import { CopyableItem } from '../ui/copyable-item';
import { Sex } from '@abc-admin/enums';
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs';
import { AppRoutes } from '@/constants/routes';

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

  const navigateTo = (route: string) => {
    setIsViewDialogOpen(false);
    router.push(route);
  };

  const handleEditPatient = () =>
    navigateTo(AppRoutes.EDIT_PATIENT.replace(':id', selectedPatient.id));

  const handleViewSchedule = () =>
    navigateTo(AppRoutes.PATIENT_SCHEDULE.replace(':id', selectedPatient.id));

  const renderSexBadge = (sex: Sex) => {
    const sexConfig = {
      [Sex.MALE]: { Icon: BsGenderMale, label: 'Male' },
      [Sex.FEMALE]: { Icon: BsGenderFemale, label: 'Female' },
      [Sex.OTHER]: { Icon: Users, label: 'Other' },
    };

    const config = sexConfig[sex] || { Icon: null, label: '' };

    return (
      <div className="flex items-center gap-1">
        {config.Icon && <config.Icon className="w-5 h-5" />}
        <p className="text-xs text-muted-foreground italic">{config.label}</p>
      </div>
    );
  };

  const isCompleted =
    selectedPatient.scheduleStatus === ScheduleStatus.completed;

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:gap-1 gap-3">
              <div className="flex items-center gap-2 sm:gap-4">
                <h3 className="text-lg font-medium">
                  {selectedPatient.firstName} {selectedPatient.middleName}{' '}
                  {selectedPatient.lastName}
                </h3>
                {renderSexBadge(selectedPatient.sex)}
              </div>
              <Badge variant={isCompleted ? 'default' : 'outline'}>
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

              {selectedPatient.email ? (
                <CopyableItem
                  label="Contact"
                  value={selectedPatient.email}
                  copyMessage="Email copied to clipboard"
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No contact information provided
                </p>
              )}

              <CopyableItem
                label="Date Registered"
                value={formatDate(selectedPatient.dateRegistered)}
                copyMessage="Date registered copied to clipboard"
              />
            </div>

            <Button
              variant="outline"
              className="w-full h-auto"
              onClick={handleViewSchedule}
            >
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {isCompleted ? 'Vaccines Completed' : 'Next Vaccination:'}
                  </p>
                  <p className="text-sm">
                    {!isCompleted &&
                      formatDate(selectedPatient.nextVaccinationDate)}
                  </p>
                </div>
              </div>
            </Button>
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setIsViewDialogOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button onClick={handleEditPatient} className="w-full sm:w-auto">
            More Details <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
