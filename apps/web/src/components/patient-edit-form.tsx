'use client';

import { ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { steps } from './patient-registration/schema';
import { PersonalInformationStep } from './patient-registration/personal-information-step';
import { ExposureDetailsStep } from './patient-registration/exposure-details-step';
import { MedicalInformationStep } from './patient-registration/medical-information-step';
import { usePatientEditForm } from './patient-edit/use-patient-edit-form';
import { EditableStepIndicator } from './patient-edit/editable-step-indicator';

interface PatientEditFormProps {
  patientId: string;
}

export default function PatientEditForm({ patientId }: PatientEditFormProps) {
  const {
    form,
    currentStep,
    isSubmitting,
    isLoading,
    modifiedFields,
    handleNext,
    handlePrevious,
    onSubmit,
    setStep,
    isCurrentStepModified,
  } = usePatientEditForm(patientId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <EditableStepIndicator
        currentStep={currentStep}
        modifiedFields={modifiedFields}
        setStep={setStep}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {/* Render the appropriate step based on currentStep */}
              {currentStep === 0 && (
                <PersonalInformationStep
                  form={form}
                  modifiedFields={modifiedFields}
                />
              )}
              {currentStep === 1 && (
                <ExposureDetailsStep
                  form={form}
                  modifiedFields={modifiedFields}
                />
              )}
              {currentStep === 2 && (
                <MedicalInformationStep
                  form={form}
                  modifiedFields={modifiedFields}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !Object.values(modifiedFields).some(
                        (modified) => modified
                      )
                    }
                    className="w-full sm:w-auto"
                    variant={isCurrentStepModified() ? 'secondary' : 'default'}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
}
