import { redirect } from 'next/navigation';
import { AuthApi, Configuration, AuthControllerLogin200Response } from '@abc-admin/api-lib';

interface LoginResponse {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

const createAuthApiClient = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const config = new Configuration({
    basePath: backendUrl,
    baseOptions: {
      withCredentials: true,
    }
  });
  
  return new AuthApi(config);
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const authApi = createAuthApiClient();
    const response = await authApi.authControllerLogin({
      data: { email, password },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return { user: response.data.user };
  } catch (error: any) {
    console.error('Login failed:', error);
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials');
    }
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function logout(): Promise<void> {
  try {
    const authApi = createAuthApiClient();
    await authApi.authControllerLogout();
    
    redirect('/');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function isAuthenticated(): boolean {
  return document.cookie.includes(`${process.env.NEXT_PUBLIC_COOKIE_NAME || 'auth_token'}=`);
}
