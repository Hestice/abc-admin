'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
import { ExposureStepIndicator } from './exposure-step-indicator';
import { ExposureDetailsStep } from '@/components/patient-registration/exposure-details-step';
import { MedicalInformationStep } from '@/components/patient-registration/medical-information-step';
import { useCreateExposureForm } from './use-create-exposure-form';

interface CreateExposureFormProps {
  patientId: string;
}

export function CreateExposureForm({ patientId }: CreateExposureFormProps) {
  const {
    form,
    currentStep,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = useCreateExposureForm(patientId);

  const steps = [
    {
      id: 'exposure-details',
      title: 'Exposure Details',
      description: 'Information about the animal bite exposure',
    },
    {
      id: 'medical-info',
      title: 'Medical Information',
      description: "Patient's medical history and treatment",
    },
  ];

  return (
    <>
      <ExposureStepIndicator currentStep={currentStep} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <CardContent className="space-y-8">
              {/* Render the appropriate step based on currentStep */}
              {currentStep === 0 && <ExposureDetailsStep form={form} />}
              {currentStep === 1 && <MedicalInformationStep form={form} />}
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
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Exposure & Schedule
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
