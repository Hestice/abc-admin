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

interface UpdateAntiTetanusProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
  administered: boolean;
  date?: Date;
}

// Create a shared API client
async function getApiClient() {
  const session = (await getSession()) as ExtendedSession | null;
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new ApiError('No authentication token found. Please log in again.');
  }

  return new PatientsApi(
    new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      accessToken: accessToken,
    })
  );
}

// Shared error handling function
function handleApiError(error: any, context: string): never {
  console.error(`API connection failed (${context}):`, error);

  if (error.response) {
    const status = error.response.status;
    let message = `An error occurred while ${context}`;

    if (status === 404) {
      message = 'Patient not found.';
    } else if (status === 400 && context.includes('update')) {
      message = 'Invalid input data. Please check your form and try again.';
    } else if (status === 401 || status === 403) {
      message = `You are not authorized to ${
        context.includes('update') ? 'update' : 'view'
      } this patient.`;
    } else if (status >= 500) {
      message = 'Server error. Please try again later.';
    }

    throw new ApiError(message, status);
  }

  throw new ApiError(
    error instanceof Error ? error.message : 'Unknown error occurred'
  );
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
    const patientsApi = await getApiClient();
    const response = await patientsApi.patientsControllerFindOne(patientId);
    return (response as any).data as EditablePatient;
  } catch (error: any) {
    handleApiError(error, 'retrieving the patient');
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
    const patientsApi = await getApiClient();
    const adaptedPatient = adaptToUpdatePatientDto(updatedPatient);
    const response = await patientsApi.patientsControllerUpdate(
      patientId,
      adaptedPatient
    );
    return (response as any).data as EditablePatient;
  } catch (error: any) {
    handleApiError(error, 'updating the patient');
  } finally {
    setIsLoading(false);
  }
};

export const updatePatientAntiTetanus = async ({
  setIsLoading,
  patientId,
  administered,
  date,
}: UpdateAntiTetanusProps): Promise<EditablePatient> => {
  setIsLoading(true);

  try {
    const patientsApi = await getApiClient();

    // Create the update payload with only anti-tetanus fields
    const updatePayload: any = {
      antiTetanusGiven: administered,
    };

    // Only include the date if administered is true and date is provided
    if (administered && date) {
      updatePayload.dateOfAntiTetanus = date.toISOString().split('T')[0];
    }

    const response = await patientsApi.patientsControllerUpdate(
      patientId,
      updatePayload
    );

    return (response as any).data as EditablePatient;
  } catch (error: any) {
    handleApiError(error, 'updating anti-tetanus information');
  } finally {
    setIsLoading(false);
  }
};
