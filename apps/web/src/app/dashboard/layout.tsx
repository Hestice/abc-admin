import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1>Dashboard</h1>
      {children}
    </>
  );
}
