import { useState } from 'react';
interface TestApiConnectionProps {
    setIsLoading: (isLoading: boolean) => void;
}

export const testApiConnection = async ({ setIsLoading }: TestApiConnectionProps) => {
    setIsLoading(true);
    const testApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

    try {
      const response = await fetch(testApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      alert(`API connection successful! Message: ${data.message}`);
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