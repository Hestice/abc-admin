import { Configuration, PatientsApi } from '@abc-admin/api-lib';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { EditablePatient, NewPatient } from '@/types/patient';
import { ApiError } from './add-patient';
import { Category } from '@abc-admin/enums';

interface ExtendedSession extends Session {
  accessToken?: string;
}

interface GetPatientConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
}

interface UpdatePatientConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
  updatedPatient: Partial<NewPatient>;
}

// Adapter function to convert Partial<NewPatient> to CreatePatientDto
const adaptToUpdatePatientDto = (patient: Partial<NewPatient>): any => {
  // Only transform fields that are defined
  const adaptedPatient: any = { ...patient };

  // Handle category if present
  if (patient.category !== undefined) {
    adaptedPatient.category = patient.category as Category;
  }

  // Handle dateOfAntiTetanus special case
  if (patient.antiTetanusGiven === false || !patient.dateOfAntiTetanus) {
    delete adaptedPatient.dateOfAntiTetanus;
  }

  return adaptedPatient;
};

export const getPatient = async ({
  setIsLoading,
  patientId,
}: GetPatientConnectionProps): Promise<EditablePatient> => {
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
    const response = await patientsApi.patientsControllerFindOne(patientId);
    // Cast to unknown first then to the expected type
    return (response as any).data as EditablePatient;
  } catch (error: any) {
    console.error('API connection failed:', error);

    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred while retrieving the patient';

      if (status === 404) {
        message = 'Patient not found.';
      } else if (status === 401 || status === 403) {
        message = 'You are not authorized to view this patient.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }

      throw new ApiError(message, status);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  } finally {
    setIsLoading(false);
  }
};

export const updatePatient = async ({
  setIsLoading,
  patientId,
  updatedPatient,
}: UpdatePatientConnectionProps): Promise<EditablePatient> => {
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
    // Adapt the patient data to the expected format
    const adaptedPatient = adaptToUpdatePatientDto(updatedPatient);

    const response = await patientsApi.patientsControllerUpdate(
      patientId,
      adaptedPatient
    );
    // Cast to unknown first then to the expected type
    return (response as any).data as EditablePatient;
  } catch (error: any) {
    console.error('API connection failed:', error);

    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred while updating the patient';

      if (status === 404) {
        message = 'Patient not found.';
      } else if (status === 400) {
        message = 'Invalid input data. Please check your form and try again.';
      } else if (status === 401 || status === 403) {
        message = 'You are not authorized to update this patient.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }

      throw new ApiError(message, status);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  } finally {
    setIsLoading(false);
  }
};
