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
import { Loader2, Calendar, AlertCircle } from 'lucide-react';
import CustomDatePicker from '@/components/custom-fields/custom-date-picker';
import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/routes';
import { ExposureDetailsStep } from '@/components/patient-registration/exposure-details-step';
import { MedicalInformationStep } from '@/components/patient-registration/medical-information-step';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormValues,
  formSchema,
} from '@/components/patient-registration/schema';
import { Form } from '@/components/ui/form';
import { Category, Status } from '@abc-admin/enums';
import { useCreateExposure } from '@/hooks/mutations/use-exposure-mutations';
import { NewExposure } from '@/types/exposure';

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
  const [exposureStep, setExposureStep] = useState<'exposure' | 'medical'>(
    'exposure'
  );
  const createExposureMutation = useCreateExposure();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize form for exposure creation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: undefined as unknown as Date,
      sex: undefined as unknown as any,
      address: '',
      email: '',
      category: undefined as unknown as Category,
      bodyPartsAffected: '',
      placeOfExposure: '',
      dateOfExposure: undefined as unknown as Date,
      sourceOfExposure: '',
      isExposureAtHome: false,
      animalStatus: Status.UNKNOWN,
      isWoundCleaned: false,
      antiTetanusGiven: false,
      dateOfAntiTetanus: undefined,
      briefHistory: '',
      allergy: 'none',
      medications: 'none',
    },
  });

  const handleCreateExposure = async () => {
    if (exposureStep === 'exposure') {
      // Validate only exposure fields for step 1
      const isValid = await form.trigger([
        'category',
        'bodyPartsAffected',
        'placeOfExposure',
        'dateOfExposure',
        'sourceOfExposure',
        'isWoundCleaned',
      ]);

      if (!isValid) {
        const errors = form.formState.errors;
        const errorFields = Object.keys(errors).filter(
          (key) =>
            [
              'category',
              'bodyPartsAffected',
              'placeOfExposure',
              'dateOfExposure',
              'sourceOfExposure',
              'isWoundCleaned',
            ].includes(key) && errors[key as keyof typeof errors]
        );

        toast({
          title: 'Validation Error',
          description: `Please fill in all required fields: ${errorFields.join(
            ', '
          )}`,
          variant: 'destructive',
        });
        return;
      }

      setExposureStep('medical');
      return;
    }

    // Validate medical fields for step 2
    const isValid = await form.trigger(['briefHistory']);

    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required medical fields.',
        variant: 'destructive',
      });
      return;
    }

    // Both steps validated, create exposure and then schedule
    try {
      const formData = form.getValues();

      const newExposure: NewExposure = {
        patientId,
        category: formData.category as number,
        bodyPartsAffected: formData.bodyPartsAffected,
        placeOfExposure: formData.placeOfExposure,
        dateOfExposure: formData.dateOfExposure.toISOString().split('T')[0],
        isExposureAtHome: formData.isExposureAtHome,
        sourceOfExposure: formData.sourceOfExposure,
        animalStatus: formData.animalStatus,
        isWoundCleaned: formData.isWoundCleaned,
        antiTetanusGiven: formData.antiTetanusGiven,
        dateOfAntiTetanus: formData.dateOfAntiTetanus
          ? formData.dateOfAntiTetanus.toISOString().split('T')[0]
          : undefined,
        briefHistory: formData.briefHistory,
        allergy: formData.allergy || 'none',
        medications: formData.medications || 'none',
      };

      // Step 1: Create exposure
      const exposureResponse = await createExposureMutation.mutateAsync(
        newExposure
      );

      const createdExposureId = exposureResponse.data.id;

      // Step 2: Create schedule for the exposure
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
        exposureId?: string;
        startDate?: string;
      } = {
        exposureId: createdExposureId,
      };

      // Use startDate if provided, otherwise use dateOfExposure
      if (startDate) {
        createScheduleDto.startDate = startDate.toISOString();
      } else if (formData.dateOfExposure) {
        createScheduleDto.startDate = formData.dateOfExposure.toISOString();
      }

      const scheduleResponse = await schedulesApi.schedulesControllerCreate(
        createScheduleDto
      );

      toast({
        title: 'Success',
        description: 'Exposure and schedule created successfully.',
      });

      // Close dialog and reset form
      setIsDialogOpen(false);
      setStartDate(undefined);
      setExposureStep('exposure');
      form.reset();

      // Call callback to refresh schedules list
      if (onScheduleCreated) {
        onScheduleCreated();
      }

      // Navigate to the edit page for the new schedule
      router.push(
        AppRoutes.EDIT_PATIENT.replace(':id', patientId).replace(
          ':scheduleId',
          scheduleResponse.data.id
        )
      );
    } catch (error: any) {
      console.error('Error creating exposure and schedule:', error);

      // Extract error message from API response
      let errorMessage =
        'Failed to create exposure and schedule. Please try again.';
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
    }
  };

  const isLoading = createExposureMutation.isPending;

  const handleClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setStartDate(undefined);
      setExposureStep('exposure');
      form.reset();
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exposure & Schedule</DialogTitle>
          <DialogDescription>
            Provide exposure information. A vaccination schedule will be created
            automatically after submission.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4 py-4">
              {exposureStep === 'exposure' ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <span>Exposure Details (Step 1 of 2)</span>
                    </div>
                    <ExposureDetailsStep form={form as any} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <span>Medical Information (Step 2 of 2)</span>
                    </div>
                    <MedicalInformationStep form={form as any} />

                    <div className="space-y-2 pt-4">
                      <Label htmlFor="start-date">
                        Schedule Start Date (Optional)
                      </Label>
                      <CustomDatePicker
                        value={startDate}
                        onChange={setStartDate}
                        placeholder="Select start date or leave blank to use exposure date"
                        maxDate={new Date()}
                        showFormField={false}
                      />
                      <p className="text-xs text-muted-foreground">
                        If no date is selected, the schedule will start on the
                        exposure date.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (exposureStep === 'medical') {
                    setExposureStep('exposure');
                  } else {
                    handleClose(false);
                  }
                }}
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                {exposureStep === 'medical' ? 'Back' : 'Cancel'}
              </Button>
              <Button
                type="button"
                onClick={handleCreateExposure}
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : exposureStep === 'exposure' ? (
                  'Next: Medical Info'
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Exposure & Schedule
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
