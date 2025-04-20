'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { Category, Sex, Status } from '@abc-admin/enums';
import { FormValues, formSchema, steps } from './schema';
import { addPatient } from '@/utils/add-patient';
import { NewPatient } from '@/types/patient';

// Helper to convert form data to NewPatient format
const formatPatientData = (data: FormValues): NewPatient => {
  // Create base patient object
  const patient: any = {
    firstName: data.firstName,
    middleName: data.middleName || '',
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
    dateOfExposure: data.dateOfExposure.toISOString().split('T')[0],
    sex: data.sex as Sex,
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
    console.log('Raw form data:', data);

    const formattedData = formatPatientData(data);
    console.log('Formatted data for submission:', formattedData);

    try {
      await addPatient({
        setIsLoading: setIsSubmitting,
        newPatient: formattedData,
      });
      router.push('/patients');
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
