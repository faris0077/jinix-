'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Bell, CheckCheck, Sparkles, ExternalLink, Filter } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentNotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadNotificationCount } = useChavaraStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'approval'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'approval') return notif.type === 'approval';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-violet-600" />
            <span>Notification Center</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Stay informed on leave approvals, kitchen cutoff timers, and campus announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm">
        <Filter className="w-4 h-4 text-zinc-400 mr-1" />
        {[
          { id: 'all', label: 'All Notifications', count: notifications.length },
          { id: 'unread', label: 'Unread Only', count: unreadNotificationCount },
          { id: 'approval', label: 'Warden Approvals', count: notifications.filter(n => n.type === 'approval').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5',
              filter === tab.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            )}
          >
            <span>{tab.label}</span>
            <span className={cn('px-1.5 py-0.5 rounded-full text-[10px]', filter === tab.id ? 'bg-violet-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400')}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center space-y-3">
            <Sparkles className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto animate-pulse" />
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">No notifications found</h3>
            <p className="text-xs text-zinc-500">There are no notifications matching your current filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => markNotificationAsRead(notif.id)}
              className={cn(
                'p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                notif.read
                  ? 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60'
                  : 'bg-white dark:bg-zinc-900 border-violet-500/40 shadow-lg shadow-violet-500/5 ring-1 ring-violet-500/20'
              )}
            >
              {!notif.read && (
                <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
              )}

              <div className="space-y-1 flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    {notif.title}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {notif.type}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[11px] text-zinc-400 font-medium block pt-1">
                  {notif.timestamp}
                </span>
              </div>

              {notif.link && (
                <Link
                  href={notif.link}
                  className="shrink-0 px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>Open Module</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
