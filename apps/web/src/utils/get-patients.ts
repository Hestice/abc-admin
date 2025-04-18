import { Configuration, PatientsApi } from '@abc-admin/api-lib';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Patient } from '@/types/patient';

// Define the extended session type
interface ExtendedSession extends Session {
  accessToken?: string;
}

interface GetPatientsConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const getPatients = async ({
  setIsLoading,
}: GetPatientsConnectionProps): Promise<Patient[]> => {
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
    const response = await patientsApi.patientsControllerFindAll();
    return (response as unknown as { data: Patient[] }).data;
  } catch (error) {
    console.error('API connection failed:', error);
    alert(
      `failed to get users: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    return [];
  } finally {
    setIsLoading(false);
  }
};
