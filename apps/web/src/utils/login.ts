import { AuthApi, Configuration } from '@abc-admin/api-lib';
import cookie from 'js-cookie';

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

const authTokenName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'auth_token';

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const authApi = createAuthApiClient();
    console.log("Sending login request to:", process.env.NEXT_PUBLIC_BACKEND_URL);
    
    const response = await authApi.authControllerLogin({
      data: { email, password },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("Login response:", response);
    console.log("Cookies after login:", document.cookie);
    
      if (!cookie.get(authTokenName)) {
      try {
        await authApi.authControllerGetToken({
          data: { email, password },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!cookie.get(authTokenName)) {
          console.log("Cookie still not set after get-token call");
        } else {
          console.log("Cookie successfully set by get-token call");
        }
      } catch (error) {
        console.error("Failed to get token:", error);
      }
    }
    
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
    cookie.remove(authTokenName);
    console.log("Logged out");
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function isAuthenticated(): boolean {
  return cookie.get(authTokenName) !== undefined;
}
