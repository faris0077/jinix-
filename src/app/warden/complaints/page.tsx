'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { motion, AnimatePresence, springs, EASE_OUT, Reveal } from '@/lib/motion';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Complaint } from '@/lib/mock-data';
import { Wrench, CheckCircle2, UserPlus, Sparkles, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function WardenComplaintsPage() {
  const { complaints, updateComplaintStatus } = useChavaraStore();
  const [filter, setFilter] = useState<'all' | 'submitted' | 'in-progress' | 'resolved'>('all');

  const filteredData = complaints.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const handleResolve = (id: string, title: string) => {
    updateComplaintStatus(id, 'resolved');
    toast.success(`Ticket closed: ${title}`, {
      description: 'Student has been notified of ticket resolution.',
    });
  };

  const handleAssign = (id: string, title: string) => {
    updateComplaintStatus(id, 'in-progress', 'Mr. Rajesh Kumar (Senior IT & Electrical Engineer)');
    toast.info(`Assigned specialist to ticket: ${title}`, {
      description: 'Maintenance team dispatched to location.',
    });
  };

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: 'id',
      header: 'Ticket ID',
      cell: ({ row }) => <span className="font-mono font-bold text-xs text-violet-600 dark:text-violet-400">{row.original.id}</span>,
    },
    {
      accessorKey: 'title',
      header: 'Complaint & Resident',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-white">{row.original.title}</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">{row.original.category}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">Reported by Resident in Room {row.original.roomNumber || '304A'} ({row.original.createdAt})</p>
        </div>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned Specialist',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          {row.original.assignedTo || 'Unassigned Queue'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Supervisory Action',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <AnimatePresence mode="wait" initial={false}>
            {item.status === 'resolved' ? (
              <motion.span
                key="resolved"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="text-xs font-semibold text-emerald-600 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
              </motion.span>
            ) : (
              <motion.div
                key="actions"
                initial={false}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeIn' }}
                className="flex items-center gap-1.5"
              >
                <motion.button
                  onClick={() => handleAssign(item.id, item.title)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-violet-50 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-violet-500" /> Assign Tech
                </motion.button>
                <motion.button
                  onClick={() => handleResolve(item.id, item.title)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Wrench className="w-6 h-6 text-violet-600" />
          <span>Warden Helpdesk & Maintenance Supervision</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Monitor Block B maintenance tickets. Assign IT/plumbing engineers and sign off on resolved complaints.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-zinc-50/80 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
        <Filter className="w-4 h-4 text-zinc-400 mr-1" />
        {[
          { id: 'all', label: 'All Tickets', count: complaints.length },
          { id: 'submitted', label: 'Unassigned Queue', count: complaints.filter((c) => c.status === 'submitted').length },
          { id: 'in-progress', label: 'Work In Progress', count: complaints.filter((c) => c.status === 'in-progress').length },
          { id: 'resolved', label: 'Resolved Tickets', count: complaints.filter((c) => c.status === 'resolved').length },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            whileTap={{ scale: 0.97 }}
            transition={springs.snappy}
            className={`relative px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${filter === tab.id ? 'text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            {filter === tab.id && (
              <motion.div
                layoutId="complaints-filter-pill"
                transition={springs.soft}
                className="absolute inset-0 rounded-xl bg-violet-600 shadow-md"
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            <span className={`relative z-10 px-1.5 py-0.2 rounded-full text-[10px] ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>{tab.count}</span>
          </motion.button>
        ))}
      </div>

      <Reveal delay={0.1}>
        <DataTable columns={columns} data={filteredData} searchPlaceholder="Search ticket title or room number..." title="Block B Maintenance Log" />
      </Reveal>
    </div>
  );
}
