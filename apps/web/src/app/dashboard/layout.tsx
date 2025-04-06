import { AuthProvider } from '@/contexts/AuthContext';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <h1>Dashboard</h1>
      {children}
    </AuthProvider>
  );
}
