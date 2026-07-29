'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

export type BadgeStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'in-progress'
  | 'completed'
  | 'submitted'
  | 'resolved'
  | 'paid'
  | 'overdue'
  | 'available'
  | 'full'
  | 'maintenance'
  | 'present'
  | 'on-leave'
  | 'outpass'
  | 'library'
  | 'veg'
  | 'non-veg'
  | 'vegan'
  | 'arrived-gate'
  | 'collected'
  | 'en-route';

interface StatusBadgeProps {
  status: BadgeStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = 'md', showIcon = true, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase() as BadgeStatus;

  const getConfig = () => {
    switch (normalized) {
      case 'approved':
      case 'resolved':
      case 'paid':
      case 'present':
      case 'available':
      case 'completed':
      case 'collected':
      case 'veg':
      case 'vegan':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          icon: CheckCircle2,
          label: status,
        };
      case 'pending':
      case 'submitted':
      case 'in-progress':
      case 'on-leave':
      case 'outpass':
      case 'library':
      case 'en-route':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
          icon: Clock,
          label: status,
        };
      case 'arrived-gate':
        return {
          bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 animate-pulse',
          icon: CheckCircle2,
          label: 'arrived at gate',
        };
      case 'rejected':
      case 'overdue':
      case 'full':
      case 'non-veg':
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
          icon: XCircle,
          label: status,
        };
      case 'maintenance':
        return {
          bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
          icon: AlertCircle,
          label: status,
        };
      default:
        return {
          bg: 'bg-zinc-500/10 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-500/30',
          icon: HelpCircle,
          label: status,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 rounded-md font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 rounded-xl font-bold',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border capitalize tracking-tight transition-all select-none whitespace-nowrap',
        config.bg,
        sizeClasses,
        className
      )}
    >
      {showIcon && <Icon className={cn('shrink-0', size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />}
      <span>{config.label.replace(/-/g, ' ')}</span>
    </span>
  );
}
