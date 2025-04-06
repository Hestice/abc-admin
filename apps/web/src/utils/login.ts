import { AuthApi, Configuration } from '@abc-admin/api-lib';
import { redirect } from 'next/navigation';
import { AxiosError } from 'axios';
interface LoginDto {
  email: string;
  password: string;
}

interface LoginResponse {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}


export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const configuration = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL
    });
    
    const authApi = new AuthApi(configuration);
    const loginDto: LoginDto = { email, password };
    
    const response = await authApi.authControllerLogin({
      data: loginDto,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return { user: response.data.user };
  } catch (error) {
    console.error('Login failed:', error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      return Promise.reject(new Error('Invalid credentials'));
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const configuration = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL
    });
    
    const authApi = new AuthApi(configuration);
    await authApi.authControllerLogout();
    
    redirect('/');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function isAuthenticated(): boolean {
  return document.cookie.includes('user_role=');
}
