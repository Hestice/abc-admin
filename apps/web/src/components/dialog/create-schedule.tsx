'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Loader2, Calendar } from 'lucide-react';
import CustomDatePicker from '@/components/custom-fields/custom-date-picker';
import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/routes';

interface CreateScheduleDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  patientId: string;
  onScheduleCreated?: () => void;
}

export default function CreateScheduleDialog({
  isDialogOpen,
  setIsDialogOpen,
  patientId,
  onScheduleCreated,
}: CreateScheduleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreate = async () => {
    if (!patientId) {
      toast({
        title: 'Error',
        description: 'Patient ID is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { session } = await getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const config = new Configuration({
        basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
        accessToken: accessToken,
      });

      const schedulesApi = new SchedulesApi(config);
      const createScheduleDto: {
        patientId?: string;
        exposureId?: string;
        startDate?: string;
      } = {
        patientId, // Backend will find most recent exposure or create new one
      };

      // Only include startDate if it's provided
      if (startDate) {
        createScheduleDto.startDate = startDate.toISOString();
      }

      const response = await schedulesApi.schedulesControllerCreate(
        createScheduleDto
      );

      toast({
        title: 'Success',
        description: 'Schedule created successfully.',
      });

      // Close dialog and reset form
      setIsDialogOpen(false);
      setStartDate(undefined);

      // Call callback to refresh schedules list
      if (onScheduleCreated) {
        onScheduleCreated();
      }

      // Navigate to the edit page for the new schedule
      router.push(
        AppRoutes.EDIT_PATIENT.replace(':id', patientId).replace(
          ':scheduleId',
          response.data.id
        )
      );
    } catch (error: any) {
      console.error('Error creating schedule:', error);

      // Extract error message from API response
      let errorMessage = 'Failed to create schedule. Please try again.';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setStartDate(undefined);
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription>
            Create a new vaccination schedule for this patient. You can
            optionally set a start date, or leave it blank to use today's date.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date (Optional)</Label>
            <CustomDatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date or leave blank for today"
              maxDate={new Date()}
              showFormField={false}
            />
            <p className="text-xs text-muted-foreground">
              If no date is selected, the schedule will start today.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Create Schedule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
