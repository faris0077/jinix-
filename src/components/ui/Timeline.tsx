'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, AlertCircle, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TimelineStep {
  title: string;
  description: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn('relative pl-6 space-y-6', className)}>
      {/* Vertical line */}
      <div className="absolute top-2.5 bottom-2.5 left-2.5 w-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />

      {steps.map((step, idx) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isRejected = step.status === 'rejected';

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-start justify-between gap-4 group"
          >
            {/* Circle Node */}
            <div
              className={cn(
                'absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-950 transition-all z-10',
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : isCurrent
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/40 animate-pulse'
                  : isRejected
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : isCurrent ? (
                <Clock className="w-3.5 h-3.5" />
              ) : isRejected ? (
                <XCircle className="w-3.5 h-3.5" />
              ) : (
                <Circle className="w-2.5 h-2.5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 bg-white/50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 transition-all hover:border-violet-500/30">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4
                  className={cn(
                    'text-sm font-bold truncate',
                    isCurrent
                      ? 'text-violet-600 dark:text-violet-400'
                      : isRejected
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-zinc-900 dark:text-white'
                  )}
                >
                  {step.title}
                </h4>
                {step.timestamp && (
                  <span className="text-[11px] font-medium text-zinc-400 shrink-0">
                    {step.timestamp}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
