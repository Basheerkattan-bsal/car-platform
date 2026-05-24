import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';
import AuthHydrator from '../components/auth/AuthHydrator';

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
    <html lang='en'>
      <body>
        <Providers>
          <AuthHydrator />
          {children}
        </Providers>
      </body>
    </html>
  );
}
