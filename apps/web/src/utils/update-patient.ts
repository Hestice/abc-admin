import { Configuration, PatientsApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { EditablePatient, NewPatient } from '@/types/patient';
import { ApiError } from './add-patient';
import { Category } from '@abc-admin/enums';

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
  const { session } = await getSession();
  const accessToken = session?.access_token;

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
// Only includes patient metadata fields (exposure fields should be updated separately)
const adaptToUpdatePatientDto = (patient: Partial<NewPatient>): any => {
  // Only include patient metadata fields
  const adaptedPatient: any = {};

  if (patient.firstName !== undefined)
    adaptedPatient.firstName = patient.firstName;
  if (patient.middleName !== undefined)
    adaptedPatient.middleName = patient.middleName;
  if (patient.lastName !== undefined)
    adaptedPatient.lastName = patient.lastName;
  if (patient.dateOfBirth !== undefined)
    adaptedPatient.dateOfBirth = patient.dateOfBirth;
  if (patient.sex !== undefined) adaptedPatient.sex = patient.sex;
  if (patient.address !== undefined) adaptedPatient.address = patient.address;
  if (patient.email !== undefined) adaptedPatient.email = patient.email;

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
  // Note: Anti-tetanus is now part of exposure, not patient
  // This function should be updated to update the exposure instead
  // For now, this is a placeholder that will need to be refactored
  throw new Error(
    'updatePatientAntiTetanus should be updated to update exposure instead of patient'
  );
};
