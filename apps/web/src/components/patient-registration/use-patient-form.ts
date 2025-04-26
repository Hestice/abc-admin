'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { Category, Sex, Status } from '@abc-admin/enums';
import { FormValues, formSchema, steps } from './schema';
import { addPatient } from '@/utils/add-patient';
import { NewPatient } from '@/types/patient';
import { AppRoutes } from '@/constants/routes';
import { capitalizeFields } from '@/utils/string-utils';

// Helper to convert form data to NewPatient format
const formatPatientData = (data: FormValues): NewPatient => {
  // Define fields that should be capitalized
  const fieldsToCapitalize = [
    'firstName',
    'middleName',
    'lastName',
    'address',
    'bodyPartsAffected',
    'placeOfExposure',
    'sourceOfExposure',
    'allergy',
    'medications',
  ];

  // Capitalize relevant fields
  const capitalizedData = capitalizeFields(data, fieldsToCapitalize);

  // Create base patient object with capitalized data
  const patient: any = {
    firstName: capitalizedData.firstName,
    middleName: capitalizedData.middleName || '',
    lastName: capitalizedData.lastName,
    dateOfBirth: capitalizedData.dateOfBirth.toISOString().split('T')[0],
    dateOfExposure: capitalizedData.dateOfExposure.toISOString().split('T')[0],
    sex: capitalizedData.sex as Sex,
    address: capitalizedData.address,
    email: capitalizedData.email || '',
    category: Number(capitalizedData.category),
    bodyPartsAffected: capitalizedData.bodyPartsAffected,
    placeOfExposure: capitalizedData.placeOfExposure,
    isExposureAtHome: capitalizedData.isExposureAtHome,
    sourceOfExposure: capitalizedData.sourceOfExposure,
    animalStatus: capitalizedData.animalStatus,
    isWoundCleaned: capitalizedData.isWoundCleaned,
    antiTetanusGiven: capitalizedData.antiTetanusGiven,
    briefHistory: capitalizedData.briefHistory,
    allergy: capitalizedData.allergy,
    medications: capitalizedData.medications,
  };

  // Only include dateOfAntiTetanus if anti-tetanus was given and a date was selected
  if (capitalizedData.antiTetanusGiven && capitalizedData.dateOfAntiTetanus) {
    patient.dateOfAntiTetanus = capitalizedData.dateOfAntiTetanus
      .toISOString()
      .split('T')[0];
  }
  return patient;
};

export function usePatientForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: undefined as unknown as Date,
      sex: undefined as unknown as Sex,
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
      allergy: '',
      medications: '',
    },
    mode: 'onChange',
  });

  // Watch for changes to isExposureAtHome and update placeOfExposure accordingly
  const isExposureAtHome = form.watch('isExposureAtHome');

  useEffect(() => {
    if (isExposureAtHome) {
      form.setValue('placeOfExposure', 'Home');
    } else if (form.getValues('placeOfExposure') === 'Home') {
      form.setValue('placeOfExposure', '');
    }
  }, [isExposureAtHome, form]);

  // Check if the current step is valid
  const isCurrentStepValid = async () => {
    const fields = steps[currentStep].fields;
    const result = await form.trigger(fields as any);
    return result;
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await isCurrentStepValid();
    if (isValid) {
      const nextStep = Math.min(currentStep + 1, steps.length - 1);

      // If we're moving to the medical information step
      if (nextStep === 2) {
        // Temporarily clear the briefHistory error so it doesn't show immediately
        setTimeout(() => {
          form.clearErrors('briefHistory');
        }, 0);
      }

      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    const formattedData = formatPatientData(data);

    try {
      const response = await addPatient({
        setIsLoading: setIsSubmitting,
        newPatient: formattedData,
      });

      type ApiResponse = { data: { id: string } };
      const createdPatientId = (response as ApiResponse).data.id;
      if (createdPatientId) {
        router.push(
          AppRoutes.PATIENT_SCHEDULE.replace(':id', createdPatientId)
        );
      } else {
        router.push(AppRoutes.PATIENTS);
      }
    } catch (error) {
      console.error('Error submitting patient data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    isSubmitting,
    handleNext,
    handlePrevious,
    onSubmit,
  };
}
