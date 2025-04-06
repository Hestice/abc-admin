'use client';
import React, { useState } from 'react';
import LoginCard from '@/components/login-card';
import { Button } from '@/components/ui/button';
import { testApiConnection } from '@/utils/test-api-connection';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center h-auto gap-16">
      <LoginCard />
      <Button
        onClick={() => testApiConnection({ setIsLoading })}
        disabled={isLoading}
        variant="link"
      >
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </Button>
    </div>
  );
}
