import { UsersApi, Configuration } from '@abc-admin/api-lib';
import { Admin } from '@/types/admin';
import { getSession } from '@/lib/auth/client';
import { ApiError } from './add-patient';

export const getUsers = async (): Promise<Admin[]> => {
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

  const usersApi = new UsersApi(config);
  const response = await usersApi.usersControllerFindAll();
  return (response as unknown as { data: Admin[] }).data;
};
