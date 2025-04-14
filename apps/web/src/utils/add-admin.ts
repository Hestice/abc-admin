import { UsersApi, Configuration } from '@abc-admin/api-lib';
import { Admin, NewAdmin } from '@/types/admin';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  accessToken?: string;
}

interface AddUserConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  newAdmin: NewAdmin;
}

export const addUser = async ({
  setIsLoading,
  newAdmin,
}: AddUserConnectionProps): Promise<Admin[]> => {
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
    const response = await usersApi.usersControllerCreate(newAdmin);
    return (response as unknown as { data: Admin[] }).data;
  } catch (error) {
    console.error('API connection failed:', error);
    alert(
      `failed to add user: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    return [];
  } finally {
    setIsLoading(false);
  }
};
