'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useChavaraStore } from '@/lib/store';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { authStatus } = useChavaraStore();

  // Don't render Sidebar & Header on login or splash pages
  const isAuthPage = pathname === '/login' || pathname === '/';

  // Cloud mode auth gate: bounce unauthenticated visits away from the app
  // shell and back to /login. Local demo mode ('local' status) never gates.
  useEffect(() => {
    if (authStatus === 'unauthenticated' && !isAuthPage) {
      router.replace('/login');
    }
  }, [authStatus, isAuthPage, router]);

  if (isAuthPage) {
    return (
      <main className="min-h-screen w-full bg-background">
        {children}
      </main>
    );
  }

  // While checking for an existing session, or once we know there isn't one
  // and a redirect to /login is in flight, render nothing rather than a
  // flash of another user's last-seen dashboard.
  if (authStatus === 'loading' || authStatus === 'unauthenticated') {
    return (
      <main className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area with Sticky Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header onOpenCommandPalette={() => setIsCommandOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/60">
          <div className="max-w-7xl mx-auto space-y-8 pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  );
}
