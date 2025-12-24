import { UsersApi, Configuration } from '@abc-admin/api-lib';
import { Admin, NewAdmin } from '@/types/admin';
import { getSession } from '@/lib/auth/client';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const addUser = async (newAdmin: NewAdmin): Promise<Admin[]> => {
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
    const usersApi = new UsersApi(config);
    const response = await usersApi.usersControllerCreate(newAdmin);
    return (response as unknown as { data: Admin[] }).data;
  } catch (error: any) {
    console.error('API connection failed:', error);

    // Check for specific API error responses
    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred while adding the user';

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
