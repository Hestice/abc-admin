import './global.css';
import { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
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
      <body className="min-h-screen">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
