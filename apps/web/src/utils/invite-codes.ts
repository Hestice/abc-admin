import { InviteCodesApi, Configuration } from '@abc-admin/api-lib';
import { createClient } from '@/lib/supabase/client';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function getApiClient(): Promise<InviteCodesApi> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new ApiError('No authentication token found. Please log in again.');
  }

  const config = new Configuration({
    basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
    accessToken: accessToken,
  });

  return new InviteCodesApi(config);
}

export async function createInviteCode() {
  try {
    const api = await getApiClient();
    const response = await api.inviteCodesControllerCreate({});
    return (response as unknown as { data: any }).data;
  } catch (error: any) {
    console.error('API connection failed:', error);

    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred while creating the invite code';

      if (status === 401 || status === 403) {
        message = 'You are not authorized to perform this action.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      }

      throw new ApiError(message, status);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

export async function getInviteCodes() {
  try {
    const api = await getApiClient();
    const response = await api.inviteCodesControllerFindAll();
    return (response as unknown as { data: any[] }).data;
  } catch (error: any) {
    console.error('API connection failed:', error);

    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred while fetching invite codes';

      if (status === 401 || status === 403) {
        message = 'You are not authorized to perform this action.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      }

      throw new ApiError(message, status);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

export async function validateInviteCode(code: string) {
  try {
    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
    });
    const api = new InviteCodesApi(config);
    const response = await api.inviteCodesControllerValidate({ code });
    return (
      response as unknown as { data: { valid: boolean; message?: string } }
    ).data;
  } catch (error: any) {
    console.error('API connection failed:', error);

    if (error.response) {
      const errorData = error.response.data || {};
      return {
        valid: false,
        message: errorData.message || 'Failed to validate invite code',
      };
    }

    return {
      valid: false,
      message: 'Failed to validate invite code',
    };
  }
}

export async function consumeInviteCode(code: string) {
  try {
    const api = await getApiClient();
    const response = await api.inviteCodesControllerConsume({ code });
    return (response as unknown as { data: any }).data;
  } catch (error: any) {
    console.error('API connection failed:', error);

    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred while consuming the invite code';

      if (status === 400) {
        message = error.response.data?.message || 'Invalid invite code state.';
      } else if (status === 404) {
        message = 'Invite code not found.';
      } else if (status === 409) {
        message = 'Invite code has already been used.';
      } else if (status === 401) {
        message = 'Unauthorized. Please log in again.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      }

      throw new ApiError(message, status);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}
