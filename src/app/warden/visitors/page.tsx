'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { motion, AnimatePresence, listItem, springs, hoverGlow, Reveal, EASE_OUT } from '@/lib/motion';
import { ShieldCheck, Package, CheckCircle2, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function WardenVisitorsPage() {
  const { externalDeliveries, markDeliveryCollected, updateDeliveryStatus } = useChavaraStore();
  
  const pendingDeliveries = externalDeliveries.filter((d) => d.status === 'en-route' || d.status === 'arrived-gate');
  const pastDeliveries = externalDeliveries.filter((d) => d.status === 'collected');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-violet-600" />
            Security & Gate Log
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor incoming external deliveries and visitor access at the main gate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Active Deliveries */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Expected Arrivals ({pendingDeliveries.length})
          </h2>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
            {pendingDeliveries.length === 0 ? (
              <motion.div
                key="gate-clear"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="glass-card p-12 text-center rounded-3xl"
              >
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Gate is clear</h3>
                <p className="text-zinc-500">There are no expected deliveries or visitors arriving soon.</p>
              </motion.div>
            ) : (
              pendingDeliveries.map((delivery) => (
                <motion.div
                  key={delivery.id}
                  variants={listItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  {...hoverGlow}
                  className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-l-4 border-violet-500"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-zinc-900 dark:text-white">{delivery.studentName}</span>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase">
                        Room {delivery.roomNumber}
                      </span>
                      <StatusBadge status={delivery.status} size="sm" />
                    </div>
                    
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-300">
                      <strong>{delivery.platform}:</strong> {delivery.restaurantOrStore}
                      <p className="text-xs text-zinc-500 mt-1 truncate max-w-sm">{delivery.itemsSummary}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Expected: <strong className="text-zinc-700 dark:text-zinc-300">{delivery.expectedTime}</strong></span>
                      {delivery.deliveryPartnerPhone && (
                        <span>Phone: <strong className="text-zinc-700 dark:text-zinc-300">{delivery.deliveryPartnerPhone}</strong></span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {delivery.status === 'en-route' && (
                      <motion.button
                        onClick={() => updateDeliveryStatus(delivery.id, 'arrived-gate')}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={springs.snappy}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Package className="w-4 h-4" /> Mark Arrived
                      </motion.button>
                    )}
                    {delivery.status === 'arrived-gate' && (
                      <motion.button
                        onClick={() => markDeliveryCollected(delivery.id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={springs.snappy}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Collected
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Recent History */}
        <Reveal className="space-y-6" delay={0.1}>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Log</h2>

          <div className="glass-card p-5 rounded-3xl space-y-4">
            {pastDeliveries.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No recent activity.</p>
            ) : (
              <AnimatePresence initial={false}>
              {pastDeliveries.slice(0, 5).map((delivery) => (
                <motion.div
                  key={delivery.id}
                  variants={listItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{delivery.studentName}</span>
                    <span className="text-[10px] text-zinc-400">Room {delivery.roomNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                    <span>{delivery.platform} ({delivery.restaurantOrStore})</span>
                    <StatusBadge status="collected" size="sm" />
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    Arrived: {delivery.actualArrivalTime || 'Unknown'}
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
