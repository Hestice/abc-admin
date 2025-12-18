import { UsersApi, Configuration } from '@abc-admin/api-lib';
import { Admin } from '@/types/admin';
import { createClient } from '@/lib/supabase/client';

interface GetUsersConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const getUsers = async ({
  setIsLoading,
}: GetUsersConnectionProps): Promise<Admin[]> => {
  setIsLoading(true);

  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

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
