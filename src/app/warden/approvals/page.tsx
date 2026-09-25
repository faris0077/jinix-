'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { LeaveRequest } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, springs, AnimatedNumber, Reveal } from '@/lib/motion';

export default function WardenApprovalsPage() {
  const { studentLeaves, approveLeave, rejectLeave, bulkApproveLeaves, bulkRejectLeaves, logStudentReturn } = useChavaraStore();
  const [filter, setFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [typeFilter, setTypeFilter] = useState<'all' | 'outpass' | 'home' | 'library' | 'class'>('all');

  const filteredData = studentLeaves.filter((l) => {
    const matchesStatus = filter === 'all' ? true : l.status === filter;
    const matchesType = typeFilter === 'all' ? true : l.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const handleApprove = (id: string, name: string) => {
    approveLeave(id);
    toast.success(`Approved gate pass for ${name}`, {
      description: 'Student movement register updated immediately.',
    });
  };

  const handleReject = (id: string, name: string) => {
    rejectLeave(id);
    toast.error(`Rejected leave application for ${name}`, {
      description: 'Student notified via push notification.',
    });
  };

  const columns: ColumnDef<LeaveRequest>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500 w-4 h-4 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={row.original.status !== 'pending'}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500 w-4 h-4 disabled:opacity-30"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'studentName',
      header: 'Resident Student',
      cell: ({ row }) => (
        <div>
          <p className="font-extrabold text-sm text-zinc-900 dark:text-white">{row.original.studentName}</p>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-2 py-0.5 rounded mt-0.5 inline-block">
            Room {row.original.roomNumber}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Category',
      cell: ({ row }) => <span className="font-bold text-xs uppercase bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded">{row.original.type}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'Reason & Destination',
      cell: ({ row }) => (
        <div className="max-w-xs sm:max-w-md">
          <p className="font-bold text-sm text-zinc-900 dark:text-white">{row.original.reason}</p>
          {row.original.destination && (
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-violet-500 shrink-0" /> {row.original.destination}
            </p>
          )}
          {row.original.medicalCertName && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <FileText className="w-3 h-3" /> Cert: {row.original.medicalCertName}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Requested Window',
      cell: ({ row }) => (
        <div className="text-xs font-medium space-y-0.5">
          <p className="text-zinc-900 dark:text-white font-bold">{row.original.startDate}</p>
          <p className="text-zinc-500">
            Expected: {row.original.startTime ? `${row.original.startTime} to ${row.original.endTime}` : `Return by ${row.original.endDate || '—'}`}
          </p>
          {row.original.actualArrivalTime ? (
            <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Arrived: {row.original.actualArrivalTime}
            </p>
          ) : (
            <p className="text-amber-500 font-semibold italic">Not Arrived Yet</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'One-Click Decision / Gate Check',
      cell: ({ row }) => {
        const item = row.original;
        if (item.status === 'approved' || item.status === 'in-progress') {
          if (item.actualArrivalTime) {
            return (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Checked-in at Gate
              </span>
            );
          }
          return (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              onClick={() => logStudentReturn(item.studentId)}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
              title="Mark Student Returned & Arrived at Security Gate"
            >
              <UserCheck className="w-3.5 h-3.5" /> Mark Arrived at Gate
            </motion.button>
          );
        }
        if (item.status !== 'pending') {
          return <span className="text-xs text-zinc-400 font-semibold italic">Processed</span>;
        }
        return (
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              onClick={() => handleApprove(item.id, item.studentName || 'Student')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
              title="Approve Pass"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              onClick={() => handleReject(item.id, item.studentName || 'Student')}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
              title="Reject Application"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </motion.button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-violet-600" />
            <span>Unified Leave & Movement Approval Queue</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            One-click authorization for student outings, home visits, and evening library study registers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-300/40 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <AnimatedNumber value={studentLeaves.filter((l) => l.status === 'pending').length} format={(v) => `${Math.round(v)}`} /> Pending in Queue
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-50/80 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Status:</span>
          {[
            { id: 'pending', label: 'Pending Queue', count: studentLeaves.filter((l) => l.status === 'pending').length },
            { id: 'all', label: 'All Requests', count: studentLeaves.length },
            { id: 'approved', label: 'Approved', count: studentLeaves.filter((l) => l.status === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: studentLeaves.filter((l) => l.status === 'rejected').length },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                'relative px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5',
                filter === tab.id
                  ? 'text-white'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              )}
            >
              {filter === tab.id && (
                <motion.div
                  layoutId="approvals-status-pill"
                  className="absolute inset-0 rounded-xl bg-violet-600 shadow-md shadow-violet-600/20"
                  transition={springs.soft}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span className={cn('relative z-10 px-1.5 py-0.5 rounded-full text-[10px]', filter === tab.id ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500')}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 mr-1">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl glass-control text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500 capitalize"
          >
            <option value="all">All Categories</option>
            <option value="outpass">Local Outing</option>
            <option value="home">Home Leave</option>
            <option value="library">Library Pass</option>
            <option value="class">Class Leave</option>
          </select>
        </div>
      </div>

      {/* TanStack Table with Bulk Actions */}
      <Reveal>
        <DataTable
          columns={columns}
          data={filteredData}
          searchPlaceholder="Search student name, room number, or destination..."
          onBulkApprove={(ids) => {
            bulkApproveLeaves(ids);
            toast.success(`Bulk approved ${ids.length} applications!`, {
              description: 'Movement registers updated for all selected residents.',
            });
          }}
          onBulkReject={(ids) => {
            bulkRejectLeaves(ids);
            toast.error(`Bulk rejected ${ids.length} applications.`);
          }}
          title="Student Applications Queue"
        />
      </Reveal>
    </div>
  );
}
