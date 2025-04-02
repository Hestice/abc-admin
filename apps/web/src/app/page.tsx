'use client';
import React, { useState } from 'react';
import LoginCard from '@/components/login-card';
import { Button } from '@/components/ui/button';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

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

  return (
    <div className="w-full flex flex-col items-center justify-center h-auto gap-16">
      <LoginCard />
      <Button onClick={testApiConnection} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </Button>
    </div>
  );
}
