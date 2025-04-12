import './global.css';
import { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Web app for ABC-Carmona',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
