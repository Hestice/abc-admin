import { createClient } from '@/lib/supabase/client';

interface TestApiConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const testApiConnection = async ({
  setIsLoading,
}: TestApiConnectionProps) => {
  setIsLoading(true);
  try {
    const {
      data: { user },
      error,
    } = await createClient().auth.getUser();
    if (error || !user) {
      throw error || new Error('No authenticated Supabase user');
    }
    alert('Supabase connection successful!');
  } catch (error) {
    console.error('Supabase connection failed:', error);
    alert(
      `Supabase connection failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  } finally {
    setIsLoading(false);
  }
};
