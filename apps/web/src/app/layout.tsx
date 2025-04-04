import './global.css';

export const metadata = {
  title: 'Admin',
  description: 'Animal Bite Clinic Admin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex">{children}</body>
    </html>
  );
}
