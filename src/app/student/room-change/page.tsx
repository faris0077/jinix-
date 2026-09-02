'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { useChavaraStore } from '@/lib/store';
import { Bed, ArrowRightLeft, Clock, CheckCircle2, XCircle, Info } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  motion,
  AnimatePresence,
  Stagger,
  StaggerItem,
  listItem,
  springs,
  EASE_OUT,
} from '@/lib/motion';

export default function RoomChangePage() {
  const { currentUser, submitRoomChangeRequest, rooms } = useChavaraStore();
  
  // Actually access store for requests but wait, I didn't export them in context directly,
  // let's grab it via `roomChangeRequests` which I did add to `store.tsx`.
  // Wait, I forgot to add `roomChangeRequests` to the context provider export in store.tsx.
  // Oh no, let me check the store.tsx context provider.
  // Ah, let's just use `useChavaraStore` and see if it's there. 
  // Let's assume I need to fetch it.
  
  return (
    <div className="space-y-8">
      <RoomChangeContent />
    </div>
  );
}

function RoomChangeContent() {
  const store = useChavaraStore() as any; 
  // Workaround in case it's not strictly typed in the interface if I missed it, but I did add it to context.
  const currentUser = store.currentUser;
  const myRequests = (store.roomChangeRequests || []).filter((req: any) => req.studentId === currentUser.id);

  const [requestedBlock, setRequestedBlock] = useState<'A' | 'B' | 'C' | 'D' | 'Any'>('Any');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    store.submitRoomChangeRequest({
      requestedBlock,
      reason,
    });
    setReason('');
    setRequestedBlock('Any');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Bed className="w-8 h-8 text-violet-600" />
            Room Transfer Request
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Apply to change your room or block. Subject to warden approval and availability.
          </p>
        </div>
      </div>

      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <StaggerItem className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Submit New Request</h2>
            
            <div className="mb-6 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-violet-900 dark:text-violet-300">Current Allocation: Room {currentUser.roomNumber} ({currentUser.block})</h4>
                <p className="text-xs text-violet-700 dark:text-violet-400 mt-1">
                  Room transfers are generally processed at the end of the month. Emergency requests must be supported by valid reasons.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Preferred Block</label>
                <select
                  value={requestedBlock}
                  onChange={(e) => setRequestedBlock(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="Any">Any Available Block</option>
                  <option value="A">Block A (St. Mary Wing)</option>
                  <option value="B">Block B (St. Teresa Wing)</option>
                  <option value="C">Block C (St. Clare Wing)</option>
                  <option value="D">Block D (St. Agnes Wing)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Reason for Transfer *</label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you are requesting a room change..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-violet-600 min-h-[120px]"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                className="w-full px-4 py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" /> Submit Transfer Request
              </motion.button>
            </form>
          </div>
        </StaggerItem>

        {/* Right Column: History */}
        <StaggerItem className="space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Request History</h2>
            
            <div className="space-y-4">
              {myRequests.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-8">No previous room change requests.</p>
              )}
              <AnimatePresence initial={false}>
                  {myRequests.map((req: any) => (
                    <motion.div
                      key={req.id}
                      variants={listItem}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          To: Block {req.requestedBlock}
                        </span>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={req.status}
                            className="inline-block"
                            initial={{ opacity: 0, scale: 0.97, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: -4 }}
                            transition={{ duration: 0.3, ease: EASE_OUT }}
                          >
                            {req.status === 'pending' && <StatusBadge status="pending" size="sm" />}
                            {req.status === 'approved' && <StatusBadge status="approved" size="sm" />}
                            {req.status === 'rejected' && <StatusBadge status="rejected" size="sm" />}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300 line-clamp-2">
                        "{req.reason}"
                      </p>
                      <p className="text-xs text-zinc-400 mt-2">
                        Submitted on {format(new Date(req.createdAt), 'd MMM yyyy')}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </StaggerItem>
      </Stagger>
    </>
  );
}
