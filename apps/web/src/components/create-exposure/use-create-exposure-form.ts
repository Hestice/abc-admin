'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { Category, Status } from '@abc-admin/enums';
import {
  FormValues,
  formSchema,
} from '@/components/patient-registration/schema';
import { addExposure } from '@/utils/add-exposure';
import { NewExposure } from '@/types/exposure';
import { AppRoutes } from '@/constants/routes';
import { capitalizeFields } from '@/utils/string-utils';
import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { useToast } from '@/hooks/use-toast';

const exposureStepFields = [
  'category',
  'bodyPartsAffected',
  'placeOfExposure',
  'dateOfExposure',
  'sourceOfExposure',
  'isWoundCleaned',
];

const medicalStepFields = ['briefHistory'];

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
    allergy: capitalizedData.allergy || 'none',
    medications: capitalizedData.medications || 'none',
  };

  // Only include dateOfAntiTetanus if anti-tetanus was given and a date was selected
  if (capitalizedData.antiTetanusGiven && capitalizedData.dateOfAntiTetanus) {
    exposure.dateOfAntiTetanus = capitalizedData.dateOfAntiTetanus
      .toISOString()
      .split('T')[0];
  }

  return exposure;
};

export function useCreateExposureForm(patientId: string) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize the form with default values (only exposure-related fields)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
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
    const fields = currentStep === 0 ? exposureStepFields : medicalStepFields;
    const result = await form.trigger(fields as any);
    return result;
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await isCurrentStepValid();
    if (isValid) {
      const nextStep = Math.min(currentStep + 1, 1);

      // If we're moving to the medical information step
      if (nextStep === 1) {
        // Temporarily clear the briefHistory error so it doesn't show immediately
        setTimeout(() => {
          form.clearErrors('briefHistory');
        }, 0);
      }

      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive',
      });
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  // Handle form submission (without validation - validation is done before calling this)
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Step 1: Create exposure
      const exposureData = formatExposureData(data, patientId);
      const exposureResponse = await addExposure({
        setIsLoading: setIsSubmitting,
        newExposure: exposureData,
      });

      const createdExposureId = exposureResponse.data.id;

      if (!createdExposureId) {
        throw new Error('Failed to create exposure');
      }

      // Step 2: Create schedule for the exposure
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
      const createScheduleDto: {
        exposureId?: string;
        startDate?: string;
      } = {
        exposureId: createdExposureId,
      };

      // Use dateOfExposure as start date
      if (data.dateOfExposure) {
        createScheduleDto.startDate = data.dateOfExposure.toISOString();
      }

      const scheduleResponse = await schedulesApi.schedulesControllerCreate(
        createScheduleDto
      );

      toast({
        title: 'Success',
        description: 'Exposure and schedule created successfully.',
      });

      // Navigate to the edit page for the new schedule
      router.push(
        AppRoutes.EDIT_PATIENT.replace(':id', patientId).replace(
          ':scheduleId',
          scheduleResponse.data.id
        )
      );
    } catch (error: any) {
      console.error('Error creating exposure and schedule:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create exposure and schedule. Please try again.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle final submission with validation
  const handleSubmit = async () => {
    // Validate medical step fields
    const isValid = await form.trigger(medicalStepFields as any);
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // Get form data and submit
    const formData = form.getValues();
    await onSubmit(formData);
  };

  return {
    form,
    currentStep,
    isSubmitting,
    handleNext,
    handlePrevious,
    onSubmit,
    handleSubmit,
  };
}
