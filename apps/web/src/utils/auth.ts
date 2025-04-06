import { AuthApi, Configuration } from '@abc-admin/api-lib';

interface UserProfile {
  id: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    
    const configuration = new Configuration({
      basePath: backendUrl,
      baseOptions: {
        withCredentials: true
      }
    });
    
    const authApi = new AuthApi(configuration);
    const response = await authApi.authControllerGetProfile();
    
    return response.data as unknown as UserProfile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

export function isAdmin(userRole: string | null): boolean {
  return userRole === 'ADMIN';
}

export async function verifyAuthentication(): Promise<boolean> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    
    const configuration = new Configuration({
      basePath: backendUrl,
      baseOptions: {
        withCredentials: true
      }
    });
    
    const authApi = new AuthApi(configuration);
    await authApi.authControllerVerifyToken();
    return true;
  } catch (error) {
    return false;
  }
} 