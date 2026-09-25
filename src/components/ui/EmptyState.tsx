'use client';

import React from 'react';
import { BarChart3, type LucideIcon } from 'lucide-react';
import { motion, EASE_OUT } from '@/lib/motion';

interface EmptyStateProps {
  title?: string;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  title = 'Nothing to show yet',
  hint = 'Data will appear here as soon as it is recorded.',
  icon: Icon = BarChart3,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className={`h-full w-full min-h-[10rem] flex flex-col items-center justify-center text-center gap-3 px-6 ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-teal-500/20 blur-xl" aria-hidden />
        <div className="relative w-12 h-12 rounded-2xl glass-control flex items-center justify-center">
          <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-500 max-w-[16rem] leading-relaxed">{hint}</p>
      </div>
    </motion.div>
  );
}
