import { Configuration, PatientsApi } from '@abc-admin/api-lib';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Patient, PatientSummary } from '@/types/patient';

// Define the extended session type
interface ExtendedSession extends Session {
  accessToken?: string;
}

interface GetPatientsConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  page: number;
}

interface GetPatientConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  patientId: string;
}

export const getPatients = async ({
  setIsLoading,
  page,
}: GetPatientsConnectionProps): Promise<{
  patients: Patient[];
  total: number;
}> => {
  setIsLoading(true);

  try {
    const session = (await getSession()) as ExtendedSession | null;
    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new Error('No authentication token found. Please log in again.');
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
  } catch (error) {
    console.error('API connection failed:', error);
    alert(
      `failed to get patients: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    return { patients: [], total: 0 };
  } finally {
    setIsLoading(false);
  }
};

export const getPatient = async ({
  setIsLoading,
  patientId,
}: GetPatientConnectionProps): Promise<{ patient: PatientSummary | null }> => {
  setIsLoading(true);

  try {
    const session = (await getSession()) as ExtendedSession | null;
    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new Error('No authentication token found. Please log in again.');
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

    console.log('typedResponse', typedResponse);

    return typedResponse;
  } catch (error) {
    console.error('API connection failed:', error);
    alert(
      `failed to get patient: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    return { patient: null };
  } finally {
    setIsLoading(false);
  }
};
