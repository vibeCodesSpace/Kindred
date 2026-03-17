import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Kindred | Reconnecting Humanity',
  description: 'A platform to foster genuine human connection and combat digital isolation.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-zinc-50 min-h-screen">
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
