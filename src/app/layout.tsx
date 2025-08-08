import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../store/Providers';
import { QueryClientProvider } from '@/providers/QueryClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduApp',
  description: 'Interactive Learning Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <Providers>
            {children}
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}
