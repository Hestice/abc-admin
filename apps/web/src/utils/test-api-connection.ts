import { AppApi, Configuration } from '@abc-admin/api-lib';

interface TestApiConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const testApiConnection = async ({
  setIsLoading,
}: TestApiConnectionProps) => {
  setIsLoading(true);

  try {
    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
    });
    const appApi = new AppApi(config);

    const response = await appApi.appControllerGetData();
    console.log('API Response:', response.data);
    alert(`API connection successful!`);
  } catch (error) {
    console.error('API connection failed:', error);
    alert(
      `API connection failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  } finally {
    setIsLoading(false);
  }
};
