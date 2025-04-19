import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { Category, Sex } from '@abc-admin/enums';
import { FormValues, formSchema, steps } from './schema';

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
      isWoundCleaned: false,
      antiTetanusGiven: false,
      dateOfAntiTetanus: undefined,
      briefHistory: '',
      allergy: '',
      noAllergies: false,
      medications: '',
      noMedications: false,
    },
    mode: 'onChange',
  });

  // Watch for changes to isExposureAtHome and update placeOfExposure accordingly
  const isExposureAtHome = form.watch('isExposureAtHome');
  const noAllergies = form.watch('noAllergies');
  const noMedications = form.watch('noMedications');

  useEffect(() => {
    if (isExposureAtHome) {
      form.setValue('placeOfExposure', 'Home');
    } else if (form.getValues('placeOfExposure') === 'Home') {
      form.setValue('placeOfExposure', '');
    }
  }, [isExposureAtHome, form]);

  // Handle allergies checkbox
  useEffect(() => {
    if (noAllergies) {
      form.setValue('allergy', 'none');
    } else if (form.getValues('allergy') === 'none') {
      form.setValue('allergy', '');
    }
  }, [noAllergies, form]);

  // Handle medications checkbox
  useEffect(() => {
    if (noMedications) {
      form.setValue('medications', 'none');
    } else if (form.getValues('medications') === 'none') {
      form.setValue('medications', '');
    }
  }, [noMedications, form]);

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
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
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
    try {
      console.log('Submitting patient data:');

      // Navigate back to patients list
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
