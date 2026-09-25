'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useChavaraStore } from '@/lib/store';

function AmbientBackground() {
  return (
    <div aria-hidden className="ambient-bg ambient-noise pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
    </div>
  );
}

function SplashLoader() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <AmbientBackground />
      <div className="relative z-10 glass-strong rounded-3xl px-10 py-9 flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-600/30 ring-1 ring-white/30">
          C
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Chavara Residence OS</p>
          <p className="text-xs text-zinc-500">Preparing your workspace…</p>
        </div>
        <div className="skeleton h-1.5 w-40 !rounded-full" />
      </div>
    </main>
  );
}

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
  // and a redirect to /login is in flight, show the splash rather than a
  // flash of another user's last-seen dashboard.
  if (authStatus === 'loading' || authStatus === 'unauthenticated') {
    return <SplashLoader />;
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background p-3 gap-3">
      <AmbientBackground />

      {/* Floating glass sidebar */}
      <Sidebar />

      {/* Main column: floating glass header + scrolling content */}
      <div className="relative flex-1 flex flex-col min-w-0 gap-3">
        <Header onOpenCommandPalette={() => setIsCommandOpen(true)} />

        <main className="flex-1 overflow-y-auto rounded-3xl px-1 md:px-2 py-1">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  );
}
