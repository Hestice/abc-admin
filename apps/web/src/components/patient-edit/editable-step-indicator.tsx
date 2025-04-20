'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { steps } from '../patient-registration/schema';

interface EditableStepIndicatorProps {
  currentStep: number;
  modifiedFields: Record<string, boolean>;
  setStep: (step: number) => void;
}

export function EditableStepIndicator({
  currentStep,
  modifiedFields,
  setStep,
}: EditableStepIndicatorProps) {
  // Check if a step has any modified fields
  const isStepModified = (stepIndex: number) => {
    const stepFields = steps[stepIndex].fields;
    return stepFields.some((field) => modifiedFields[field]);
  };

  return (
    <Card className="sticky top-0 p-4 z-20 w-full">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => {
          const isModified = isStepModified(index);

          return (
            <button
              key={step.id}
              onClick={() => setStep(index)}
              className={cn(
                'flex flex-col items-center transition-colors',
                index === currentStep
                  ? 'text-primary'
                  : isModified
                  ? 'text-secondary'
                  : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border',
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'border-primary text-primary'
                    : isModified
                    ? 'border-secondary text-secondary'
                    : 'border-muted-foreground text-muted-foreground'
                )}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
            </button>
          );
        })}
      </div>
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </Card>
  );
}
