'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '@/components/ui/CommandPalette';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Don't render Sidebar & Header on login or splash pages
  const isAuthPage = pathname === '/login' || pathname === '/';

  if (isAuthPage) {
    return (
      <main className="min-h-screen w-full bg-background">
        {children}
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
