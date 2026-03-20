
import type { Metadata } from 'next';
import './globals.css';
import { DeviceProvider } from '@/lib/device-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Omni-Scent Hub | Kinetic Perfumery',
  description: 'The future of fragrance by L\'Oréal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        <DeviceProvider>
          {children}
          <Toaster />
        </DeviceProvider>
      </body>
    </html>
  );
}
