import { PatientsApi, Configuration } from '@abc-admin/api-lib';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { NewPatient } from '@/types/patient';
import { Category, Sex } from '@abc-admin/enums';

interface ExtendedSession extends Session {
  accessToken?: string;
}

interface AddPatientConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  newPatient: NewPatient;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Adapter function to convert NewPatient to CreatePatientDto
const adaptToCreatePatientDto = (patient: NewPatient): any => {
  // Map numeric sex value to enum string value
  let sexValue: Sex;
  if (patient.sex === 1) sexValue = Sex.MALE;
  else if (patient.sex === 2) sexValue = Sex.FEMALE;
  else sexValue = Sex.OTHER;

  // Create the base object
  const adaptedPatient = {
    ...patient,
    middleName: patient.middleName || '',
    email: patient.email || '',
    sex: sexValue,
    // Category is already numeric, matching the enum
    category: patient.category as Category,
  };

  // Only include dateOfAntiTetanus if it's defined and not empty
  if (!patient.antiTetanusGiven || !patient.dateOfAntiTetanus) {
    // If anti-tetanus wasn't given or no date, remove the field
    delete adaptedPatient.dateOfAntiTetanus;
  }

  console.log('Adapted patient data:', adaptedPatient);
  return adaptedPatient;
};

export const addPatient = async ({
  setIsLoading,
  newPatient,
}: AddPatientConnectionProps): Promise<NewPatient[]> => {
  setIsLoading(true);

  try {
    const session = (await getSession()) as ExtendedSession | null;
    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new ApiError('No authentication token found. Please log in again.');
    }

    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      accessToken: accessToken,
    });

    const patientsApi = new PatientsApi(config);
    const response = await patientsApi.patientsControllerCreate(
      adaptToCreatePatientDto(newPatient)
    );
    return (response as unknown as { data: NewPatient[] }).data;
  } catch (error: any) {
    console.error('API connection failed:', error);

    // Check for specific API error responses
    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred while adding the patient';

      // Handle specific status codes
      if (status === 409) {
        message =
          'This email is already registered. Please use a different email address.';
      } else if (status === 400) {
        message = 'Invalid input data. Please check your form and try again.';
      } else if (status === 401 || status === 403) {
        message = 'You are not authorized to perform this action.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }

      throw new ApiError(message, status);
    }

    // For other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  } finally {
    setIsLoading(false);
  }
};
