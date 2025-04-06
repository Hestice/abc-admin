'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/utils/login';
import React from 'react';

const handleLogout = async () => {
  await logout();
};

export default function page() {
  return (
    <div>
      <h1>Test</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
