'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { Bed, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function WardenRoomChangesPage() {
  const store = useChavaraStore() as any;
  const requests = store.roomChangeRequests || [];
  
  const pendingRequests = requests.filter((r: any) => r.status === 'pending');
  const resolvedRequests = requests.filter((r: any) => r.status !== 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Bed className="w-8 h-8 text-violet-600" />
            Room Transfer Approvals
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Review and manage student requests for room or block transfers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Pending Requests */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending Reviews ({pendingRequests.length})
          </h2>

          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-3xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">All caught up!</h3>
                <p className="text-zinc-500">There are no pending room transfer requests to review.</p>
              </div>
            ) : (
              pendingRequests.map((req: any) => (
                <div key={req.id} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-l-4 border-amber-500">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-zinc-900 dark:text-white">{req.studentName}</span>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase">
                        Current: Room {req.currentRoom}
                      </span>
                      <span className="text-zinc-400">➔</span>
                      <span className="text-[10px] font-bold text-violet-700 bg-violet-100 dark:text-violet-400 dark:bg-violet-900/30 px-2 py-0.5 rounded uppercase">
                        Requested: Block {req.requestedBlock}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      "{req.reason}"
                    </p>
                    <p className="text-xs text-zinc-400">
                      Requested on: {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => store.updateRoomChangeStatus(req.id, 'approved')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => store.updateRoomChangeStatus(req.id, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: History */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Decisions</h2>
          
          <div className="glass-card p-5 rounded-3xl space-y-4">
            {resolvedRequests.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No recent decisions.</p>
            ) : (
              resolvedRequests.map((req: any) => (
                <div key={req.id} className="pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{req.studentName}</span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <div className="text-xs text-zinc-500 font-medium">
                    Requested: Block {req.requestedBlock}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
