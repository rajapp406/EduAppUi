import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../store/Providers';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryClientProvider>
            <Providers>
              {children}
            </Providers>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
