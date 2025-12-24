import { PatientsApi, Configuration } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { NewPatient, Patient } from '@/types/patient';
import { Sex } from '@abc-admin/enums';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
  request: any;
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
  // Create the base object with only patient metadata fields
  const adaptedPatient = {
    firstName: patient.firstName,
    middleName: patient.middleName || '',
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    sex: patient.sex as Sex,
    address: patient.address,
    email: patient.email || '',
  };

  return adaptedPatient;
};

export const addPatient = async (
  newPatient: NewPatient
): Promise<ApiResponse<Patient>> => {
  const { session } = await getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new ApiError(
      'No authentication token found. Please log in again.',
      401
    );
  }

  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
    accessToken: accessToken,
  });

  try {
    const patientsApi = new PatientsApi(config);
    const response = await patientsApi.patientsControllerCreate(
      adaptToCreatePatientDto(newPatient)
    );
    return response as unknown as ApiResponse<Patient>;
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
  }
};
