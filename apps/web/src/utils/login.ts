import { AuthApi, Configuration, LoginDto } from '@abc-admin/api-lib';
import { redirect } from 'next/navigation';

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
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      credentials: 'include'
    });
    
    const authApi = new AuthApi(configuration);
    const loginDto: LoginDto = { email, password };
    
    const response = await authApi.authControllerLogin(loginDto);

    return { user: response.data.user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const configuration = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      credentials: 'include'
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
