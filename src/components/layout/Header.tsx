'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChavaraStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCheck,
  X,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { motion, AnimatePresence, springs, scaleIn, EASE_OUT } from '@/lib/motion';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export function Header({ onOpenCommandPalette }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadNotificationCount, currentUser } = useChavaraStore();

  // Generate dynamic breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const formatted = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return { name: formatted, href, isLast: index === pathSegments.length - 1 };
  });

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 flex items-center justify-between transition-colors duration-200">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 overflow-hidden text-sm">
          <Link
            href={`/${currentUser.role}/dashboard`}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium shrink-0 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />
            Chavara
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
              <Link
                href={crumb.href}
                className={cn(
                  'truncate transition-colors capitalize font-medium',
                  crumb.isLast
                    ? 'text-zinc-900 dark:text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                )}
              >
                {crumb.name}
              </Link>
            </React.Fragment>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger (Ctrl + K) */}
          <motion.button
            onClick={onOpenCommandPalette}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={springs.snappy}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-violet-500/50 transition-colors shadow-sm group w-48 sm:w-64"
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
            <span className="text-xs font-medium flex-1 text-left truncate">Search anything...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </motion.button>

          {/* Theme Toggle Button */}
          <motion.button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={springs.snappy}
            className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-colors relative group"
            title="Toggle Dark / Light Mode"
          >
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-violet-400" />
          </motion.button>

          {/* Notification Bell */}
          <div className="relative">
            <motion.button
              onClick={() => setIsNotifDrawerOpen(true)}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <AnimatePresence initial={false}>
                {unreadNotificationCount > 0 && (
                  <motion.span
                    key={unreadNotificationCount}
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15, ease: 'easeIn' } }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md"
                  >
                    {unreadNotificationCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* User Mini Avatar Badge */}
          <Link
            href={`/${currentUser.role}/profile`}
            className="flex items-center gap-2 pl-2 border-l border-zinc-200/80 dark:border-zinc-800/80 group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/20 group-hover:ring-violet-500 transition-all"
            />
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-zinc-500 capitalize mt-0.5">{currentUser.role}</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Notification Slide-over Drawer */}
      <AnimatePresence>
        {isNotifDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={springs.soft}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">Notifications</h3>
                  {unreadNotificationCount > 0 && (
                    <span className="bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Read all
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotifDrawerOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500">
                    <Sparkles className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2" />
                    <p className="text-sm font-medium">All caught up!</p>
                    <p className="text-xs text-zinc-400">No new notifications to display.</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{
                          opacity: notif.read ? 0.75 : 1,
                          x: 0,
                          transition: { duration: 0.4, ease: EASE_OUT },
                        }}
                        exit={{ opacity: 0, x: 12, transition: { duration: 0.25, ease: 'easeIn' } }}
                        layout
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={cn(
                          'p-3.5 rounded-xl border transition-colors cursor-pointer relative group',
                          notif.read
                            ? 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60'
                            : 'bg-white dark:bg-zinc-900 border-violet-500/40 shadow-md shadow-violet-500/5'
                        )}
                      >
                        {!notif.read && (
                          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-violet-600" />
                        )}

                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white pr-4">
                          {notif.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px]">
                        <span className="text-zinc-400 font-medium">{notif.timestamp}</span>
                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => setIsNotifDrawerOpen(false)}
                            className="text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1 hover:underline"
                          >
                            View details <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center">
                <Link
                  href={`/${currentUser.role}/notifications`}
                  onClick={() => setIsNotifDrawerOpen(false)}
                  className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  View full notification history →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
