import { Configuration, PatientsApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { Patient, PatientSummary } from '@/types/patient';
import { ApiError } from './add-patient';

export const getPatients = async (
  page: number
): Promise<{
  patients: Patient[];
  total: number;
}> => {
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

  const patientsApi = new PatientsApi(config);
  const response = await patientsApi.patientsControllerFindAll(page);
  const typedResponse = response.data as unknown as {
    patients: Patient[];
    total: number;
  };

  return typedResponse;
};

export const getPatientSummary = async (
  patientId: string
): Promise<{ patient: PatientSummary | null }> => {
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

  const patientsApi = new PatientsApi(config);
  const response = await patientsApi.patientsControllerFindOneAsSummary(
    patientId
  );
  const typedResponse = response.data as unknown as {
    patient: PatientSummary;
  };

  return typedResponse;
};
