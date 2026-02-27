import '../styles/globals.css';
import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from './providers';
import AuthHydrator from '../components/auth/AuthHydrator';
import AppHeader from '@/components/layout/AppHeader';

export const metadata: Metadata = {
  title: 'Car Platform',
  description: 'Marketplace platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>
          <AuthHydrator />
          <AppHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
