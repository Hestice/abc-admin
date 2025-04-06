import { AuthApi, Configuration, LoginDto } from '@abc-admin/api-lib';
import Cookies from 'js-cookie';

interface LoginResponse {
  access_token?: string;
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
    });
    
    const authApi = new AuthApi(configuration);
    const loginDto: LoginDto = { email, password };
    
    const response = await authApi.authControllerLogin(loginDto);
    
    if (response.data && response.data.access_token) {
      Cookies.set('auth_token', response.data.access_token, { 
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      if (response.data.user) {
        Cookies.set('user_info', JSON.stringify({
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role
        }), { 
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
