import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ChavaraStoreProvider } from '@/lib/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Chavara Residence OS — Luxury Ladies Hostel Management System',
  description: 'An award-winning, premium SaaS management platform for modern women residences, featuring biometric attendance, digital gate passes, and executive analytics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ChavaraStoreProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster position="top-right" richColors closeButton />
          </ChavaraStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
