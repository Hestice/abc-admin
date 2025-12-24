'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { Category, Sex, Status } from '@abc-admin/enums';
import { FormValues, formSchema, steps } from './schema';
import { useCreatePatient } from '@/hooks/mutations/use-patient-mutations';
import { useCreateExposure } from '@/hooks/mutations/use-exposure-mutations';
import { NewPatient } from '@/types/patient';
import { NewExposure } from '@/types/exposure';
import { AppRoutes } from '@/constants/routes';
import { capitalizeFields } from '@/utils/string-utils';
import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';

// Helper to convert form data to NewPatient format (metadata only)
const formatPatientData = (data: FormValues): NewPatient => {
  const fieldsToCapitalize = ['firstName', 'middleName', 'lastName', 'address'];
  const capitalizedData = capitalizeFields(data, fieldsToCapitalize);

  return {
    firstName: capitalizedData.firstName,
    middleName: capitalizedData.middleName || '',
    lastName: capitalizedData.lastName,
    dateOfBirth: capitalizedData.dateOfBirth.toISOString().split('T')[0],
    sex: capitalizedData.sex as Sex,
    address: capitalizedData.address,
    email: capitalizedData.email || '',
  };
};

// Helper to convert form data to NewExposure format
const formatExposureData = (
  data: FormValues,
  patientId: string
): NewExposure => {
  const fieldsToCapitalize = [
    'bodyPartsAffected',
    'placeOfExposure',
    'sourceOfExposure',
    'allergy',
    'medications',
  ];
  const capitalizedData = capitalizeFields(data, fieldsToCapitalize);

  const exposure: NewExposure = {
    patientId,
    category: Number(capitalizedData.category),
    bodyPartsAffected: capitalizedData.bodyPartsAffected,
    placeOfExposure: capitalizedData.placeOfExposure,
    dateOfExposure: capitalizedData.dateOfExposure.toISOString().split('T')[0],
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
    exposure.dateOfAntiTetanus = capitalizedData.dateOfAntiTetanus
      .toISOString()
      .split('T')[0];
  }

  return exposure;
};

export function usePatientForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const createPatientMutation = useCreatePatient();
  const createExposureMutation = useCreateExposure();

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
    try {
      // Step 1: Create patient
      const patientData = formatPatientData(data);
      const patientResponse = await createPatientMutation.mutateAsync(
        patientData
      );

      const createdPatientId = patientResponse.data.id;

      if (!createdPatientId) {
        throw new Error('Failed to create patient');
      }

      // Step 2: Create exposure
      const exposureData = formatExposureData(data, createdPatientId);
      const exposureResponse = await createExposureMutation.mutateAsync(
        exposureData
      );

      const createdExposureId = exposureResponse.data.id;

      if (!createdExposureId) {
        throw new Error('Failed to create exposure');
      }

      // Step 3: Create schedule
      const { session } = await getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No authentication token found');
      }

      const config = new Configuration({
        basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
        accessToken: accessToken,
      });

      const schedulesApi = new SchedulesApi(config);
      await schedulesApi.schedulesControllerCreate({
        exposureId: createdExposureId,
      });

      // Navigate to patient schedules page
      router.push(AppRoutes.PATIENT_SCHEDULES.replace(':id', createdPatientId));
    } catch (error) {
      console.error('Error submitting patient data:', error);
      // You might want to show an error toast here
    }
  };

  const isSubmitting =
    createPatientMutation.isPending || createExposureMutation.isPending;

  return {
    form,
    currentStep,
    isSubmitting,
    handleNext,
    handlePrevious,
    onSubmit,
  };
}
