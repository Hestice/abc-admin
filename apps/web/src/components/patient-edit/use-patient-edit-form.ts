'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { Category, Sex, Status } from '@abc-admin/enums';
import { FormValues, formSchema, steps } from '../patient-registration/schema';
import { getPatient, updatePatient } from '@/utils/update-patient';
import { EditablePatient, NewPatient } from '@/types/patient';
import { deepEquals } from '@/utils/object-utils';

// Helper to convert Patient data to form values
const patientToFormValues = (patient: EditablePatient): FormValues => {
  // Convert sex to enum value
  let sexValue: Sex;
  // Check if sex is a number or already a Sex enum
  if (typeof patient.sex === 'number') {
    if (patient.sex === 1) sexValue = Sex.MALE;
    else if (patient.sex === 2) sexValue = Sex.FEMALE;
    else sexValue = Sex.OTHER;
  } else {
    sexValue = patient.sex;
  }

  // Create form values object
  return {
    firstName: patient.firstName,
    middleName: patient.middleName || '',
    lastName: patient.lastName,
    dateOfBirth: new Date(patient.dateOfBirth),
    dateOfExposure: new Date(patient.dateOfExposure),
    sex: sexValue,
    address: patient.address || '',
    email: patient.email || '',
    category: patient.category as Category,
    bodyPartsAffected: patient.bodyPartsAffected,
    placeOfExposure: patient.placeOfExposure,
    isExposureAtHome: patient.isExposureAtHome,
    sourceOfExposure: patient.sourceOfExposure,
    animalStatus: patient.animalStatus || Status.UNKNOWN,
    isWoundCleaned: patient.isWoundCleaned,
    antiTetanusGiven: patient.antiTetanusGiven,
    dateOfAntiTetanus: patient.dateOfAntiTetanus
      ? new Date(patient.dateOfAntiTetanus)
      : undefined,
    briefHistory: patient.briefHistory,
    allergy: patient.allergy,
    medications: patient.medications,
  };
};

// Helper to convert form data to Patient update format
const formatPatientUpdateData = (data: FormValues): Partial<NewPatient> => {
  // Create base patient object
  const patient: Partial<NewPatient> = {
    firstName: data.firstName,
    middleName: data.middleName || '',
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
    dateOfExposure: data.dateOfExposure.toISOString().split('T')[0],
    sex: data.sex,
    address: data.address,
    email: data.email || '',
    category: Number(data.category),
    bodyPartsAffected: data.bodyPartsAffected,
    placeOfExposure: data.placeOfExposure,
    isExposureAtHome: data.isExposureAtHome,
    sourceOfExposure: data.sourceOfExposure,
    animalStatus: data.animalStatus,
    isWoundCleaned: data.isWoundCleaned,
    antiTetanusGiven: data.antiTetanusGiven,
    briefHistory: data.briefHistory,
    allergy: data.allergy,
    medications: data.medications,
  };

  // Only include dateOfAntiTetanus if anti-tetanus was given and a date was selected
  if (data.antiTetanusGiven && data.dateOfAntiTetanus) {
    patient.dateOfAntiTetanus = data.dateOfAntiTetanus
      .toISOString()
      .split('T')[0];
  }
  return patient;
};

export function usePatientEditForm(patientId: string) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalValues, setOriginalValues] = useState<FormValues | null>(null);
  const [modifiedFields, setModifiedFields] = useState<Record<string, boolean>>(
    {}
  );

  // Use refs to prevent unnecessary re-renders
  const previousFormValuesRef = useRef<string>('');
  const previousOriginalValuesRef = useRef<string>('');
  const modifiedFieldsRef = useRef<Record<string, boolean>>({});

  const router = useRouter();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    mode: 'onTouched',
  });

  // Fetch patient data on mount
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await getPatient({
          setIsLoading,
          patientId,
        });

        const formValues = patientToFormValues(patient);
        form.reset(formValues);
        setOriginalValues(formValues);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patient:', error);
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, form]);

  // Watch all form values to track modifications
  const formValues = form.watch();

  // Detect modified fields
  useEffect(() => {
    if (!originalValues) return;

    // Convert to JSON string for stable comparison
    const formValuesJson = JSON.stringify(formValues);
    const originalValuesJson = JSON.stringify(originalValues);

    // Skip if nothing changed to prevent infinite loops
    if (
      formValuesJson === previousFormValuesRef.current &&
      originalValuesJson === previousOriginalValuesRef.current
    ) {
      return;
    }

    // Update refs with current values
    previousFormValuesRef.current = formValuesJson;
    previousOriginalValuesRef.current = originalValuesJson;

    const newModifiedFields: Record<string, boolean> = {};

    // Check each field to see if it has been modified
    Object.keys(originalValues).forEach((key) => {
      const field = key as keyof FormValues;

      if (
        field === 'dateOfBirth' ||
        field === 'dateOfExposure' ||
        field === 'dateOfAntiTetanus'
      ) {
        // For Date objects, compare the ISO strings
        const originalDate = originalValues[field] as Date | undefined;
        const currentDate = formValues[field] as Date | undefined;

        // Handle potentially undefined dates safely
        const originalISO =
          originalDate instanceof Date ? originalDate.toISOString() : '';
        const currentISO =
          currentDate instanceof Date ? currentDate.toISOString() : '';

        newModifiedFields[field] = originalISO !== currentISO;
      } else {
        // For other types, compare directly
        newModifiedFields[field] = !deepEquals(
          originalValues[field],
          formValues[field]
        );
      }
    });

    // Use a stable string representation to determine if we need to update
    const newModifiedFieldsJson = JSON.stringify(newModifiedFields);
    const currentModifiedFieldsJson = JSON.stringify(modifiedFieldsRef.current);

    // Only update state if there are actual changes to avoid infinite loops
    if (newModifiedFieldsJson !== currentModifiedFieldsJson) {
      modifiedFieldsRef.current = newModifiedFields;
      // Update the state in a separate effect to avoid dependency loops
      requestAnimationFrame(() => {
        setModifiedFields(newModifiedFields);
      });
    }
  }, [formValues, originalValues]);

  // Handle setStep (for direct navigation)
  const setStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    window.scrollTo(0, 0);
  };

  // Check if any field in the current step is modified
  const isCurrentStepModified = () => {
    const fields = steps[currentStep].fields;
    return fields.some((field) => modifiedFields[field]);
  };

  // Check if the current step is valid
  const isCurrentStepValid = async (buttonType: 'next' | 'submit' = 'next') => {
    const fields = steps[currentStep].fields;

    // If moving to step 3 (Medical Information), special handling is needed
    if (currentStep === 1 && buttonType === 'next') {
      // Don't validate briefHistory when moving to step 3
      const filteredFields = fields.filter((field) => {
        return (
          field !== 'briefHistory' &&
          field !== 'allergy' &&
          field !== 'medications' &&
          field !== 'noAllergies' &&
          field !== 'noMedications'
        );
      });
      return await form.trigger(filteredFields as any);
    }

    // For regular validation
    return await form.trigger(fields as any);
  };

  // Handle next step
  const handleNext = async () => {
    // Prevent default HTML form submission behavior
    try {
      const isValid = await isCurrentStepValid('next');

      if (isValid) {
        const nextStep = Math.min(currentStep + 1, steps.length - 1);

        // If we're moving to the medical information step
        if (nextStep === 2) {
          // Preemptively clear any potential errors for fields in step 3
          form.clearErrors([
            'briefHistory',
            'allergy',
            'medications',
            'antiTetanusGiven',
            'dateOfAntiTetanus',
          ]);
        }

        // Update the step without triggering validation on the next step's fields
        setCurrentStep(nextStep);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error('Error during step navigation:', error);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      // First validate the current step specifically (with submit type)
      const isValid = await isCurrentStepValid('submit');
      if (!isValid) {
        return; // Stop if validation fails
      }

      setIsSubmitting(true);

      // We'll send the entire object - the API will handle partial updates
      const formattedData = formatPatientUpdateData(data);
      console.log('formattedData: ', formattedData);
      await updatePatient({
        setIsLoading: setIsSubmitting,
        patientId,
        updatedPatient: formattedData,
      });

      // After successful update, reset modified fields
      setOriginalValues(data);
      setModifiedFields({});

      // Reset refs
      previousFormValuesRef.current = JSON.stringify(data);
      previousOriginalValuesRef.current = JSON.stringify(data);
      modifiedFieldsRef.current = {};

      router.push('/patients');
    } catch (error) {
      console.error('Error updating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
