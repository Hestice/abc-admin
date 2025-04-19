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
import { steps } from './schema';
import { FormStepIndicator } from './form-step-indicator';
import { PersonalInformationStep } from './personal-information-step';
import { ExposureDetailsStep } from './exposure-details-step';
import { MedicalInformationStep } from './medical-information-step';
import { usePatientForm } from './use-patient-form';

export function PatientRegistrationForm() {
  const {
    form,
    currentStep,
    isSubmitting,
    handleNext,
    handlePrevious,
    onSubmit,
  } = usePatientForm();

  return (
    <>
      <FormStepIndicator currentStep={currentStep} />

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
              {currentStep === 0 && <PersonalInformationStep form={form} />}
              {currentStep === 1 && <ExposureDetailsStep form={form} />}
              {currentStep === 2 && <MedicalInformationStep form={form} />}
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
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Register Patient
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
