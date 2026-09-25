import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MotionProvider } from '@/lib/motion';
import { ChavaraStoreProvider } from '@/lib/store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700', '800'] });

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('chavara-theme');var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light')}catch(e){document.documentElement.classList.add('light')}",
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable} ${display.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <MotionProvider>
            <ChavaraStoreProvider>
              <AppLayout>
                {children}
              </AppLayout>
              <Toaster
                position="top-right"
                closeButton
                toastOptions={{
                  className: 'glass-strong',
                  style: {
                    background: 'var(--glass-bg-strong)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '1rem',
                    color: 'hsl(var(--foreground))',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                  },
                }}
              />
            </ChavaraStoreProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
