import { UsersApi, Configuration } from '@abc-admin/api-lib';
import { Admin } from '@/types/admin';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

// Define the extended session type
interface ExtendedSession extends Session {
  accessToken?: string;
}

interface TestApiConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const getUsers = async ({
  setIsLoading,
}: TestApiConnectionProps): Promise<Admin[]> => {
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

    const usersApi = new UsersApi(config);
    const response = await usersApi.usersControllerFindAll();
    return (response as unknown as { data: Admin[] }).data;
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
