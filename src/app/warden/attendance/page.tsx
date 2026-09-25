'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/mock-data';
import { Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  motion,
  AnimatePresence,
  springs,
  EASE_OUT,
  fadeUp,
  hoverLift,
  Stagger,
  AnimatedNumber,
  Reveal,
} from '@/lib/motion';

export default function WardenAttendancePage() {
  const { users } = useChavaraStore();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'outpass' | 'on-leave' | 'library'>('all');

  const students = users.filter((u) => u.role === 'student');

  const filteredData = students.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.attendanceToday === statusFilter;
  });

  const presentCount = students.filter((s) => s.attendanceToday === 'present').length;
  const outpassCount = students.filter((s) => s.attendanceToday === 'outpass').length;
  const leaveCount = students.filter((s) => s.attendanceToday === 'on-leave').length;
  const libraryCount = students.filter((s) => s.attendanceToday === 'library').length;

  const handleExportAttendance = () => {
    if (filteredData.length === 0) {
      toast.error('Nothing to export', { description: 'No residents match the current filter.' });
      return;
    }
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ['Name', 'Room', 'Status'],
      ...filteredData.map((s) => [s.name, s.roomNumber || '—', s.attendanceToday || '—']),
    ];
    const csv = rows.map((r) => r.map(escape).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Attendance report exported', { description: `Saved ${filteredData.length} records for ${selectedDate}.` });
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Resident Scholar',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.avatar ? (
            <img src={row.original.avatar} alt={row.original.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/20" />
          ) : (
            <span className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 font-extrabold text-sm flex items-center justify-center ring-2 ring-violet-500/20">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-extrabold text-sm text-zinc-900 dark:text-white">{row.original.name}</p>
            <p className="text-[11px] text-zinc-400">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'roomNumber',
      header: 'Room',
      cell: ({ row }) => (
        <span className="font-bold text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-1 rounded">
          {row.original.roomNumber ? `Room ${row.original.roomNumber}` : '—'}
        </span>
      ),
    },
    {
      accessorKey: 'attendanceToday',
      header: 'Gate Status',
      cell: ({ row }) => {
        const status = row.original.attendanceToday;
        if (!status) return <span className="text-xs text-zinc-400">—</span>;
        return (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="inline-block"
            >
              <StatusBadge status={status} />
            </motion.span>
          </AnimatePresence>
        );
      },
    },
    {
      id: 'lastSeen',
      header: 'Current Location',
      cell: ({ row }) => {
        const status = row.original.attendanceToday;
        if (!status) return <span className="text-xs text-zinc-400">—</span>;
        if (status === 'present') return <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Inside Campus</span>;
        if (status === 'outpass') return <span className="text-xs text-amber-600 font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Out on Outpass</span>;
        if (status === 'library') return <span className="text-xs text-purple-600 font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> At Library</span>;
        return <span className="text-xs text-rose-500 font-semibold">On Home Leave</span>;
      },
    },
    {
      id: 'curfew',
      header: 'Curfew Compliance',
      cell: ({ row }) => {
        const status = row.original.attendanceToday;
        if (!status) return <span className="text-xs text-zinc-400">—</span>;
        return (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status === 'outpass' ? 'due' : 'compliant'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="inline-block"
            >
              {status === 'outpass' ? (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200">
                  Return Pending
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  Compliant
                </span>
              )}
            </motion.span>
          </AnimatePresence>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-violet-600" />
            <span>Gate Attendance & Curfew Audit</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Live view of resident whereabouts based on approved passes and gate check-ins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl glass-control text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-sm"
          />
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={springs.snappy}
            onClick={handleExportAttendance}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit Report
          </motion.button>
        </div>
      </div>

      {/* Tally Cards Grid */}
      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={fadeUp}
          {...hoverLift}
          onClick={() => setStatusFilter('present')}
          className={`p-4 rounded-2xl border transition-colors cursor-pointer ${statusFilter === 'present' ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'glass-card hover:border-emerald-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Inside Campus</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block"><AnimatedNumber value={presentCount} format={(v) => `${Math.round(v)}`} /></span>
          <span className="text-[10px] text-zinc-400">Currently on campus</span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          {...hoverLift}
          onClick={() => setStatusFilter('outpass')}
          className={`p-4 rounded-2xl border transition-colors cursor-pointer ${statusFilter === 'outpass' ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 shadow-md ring-2 ring-amber-500/20' : 'glass-card hover:border-amber-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">Active Outpass</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block"><AnimatedNumber value={outpassCount} format={(v) => `${Math.round(v)}`} /></span>
          <span className="text-[10px] text-zinc-400">Currently out on outpass</span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          {...hoverLift}
          onClick={() => setStatusFilter('library')}
          className={`p-4 rounded-2xl border transition-colors cursor-pointer ${statusFilter === 'library' ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 shadow-md ring-2 ring-purple-500/20' : 'glass-card hover:border-purple-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">Digital Library Pass</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block"><AnimatedNumber value={libraryCount} format={(v) => `${Math.round(v)}`} /></span>
          <span className="text-[10px] text-zinc-400">Currently at the library</span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          {...hoverLift}
          onClick={() => setStatusFilter('on-leave')}
          className={`p-4 rounded-2xl border transition-colors cursor-pointer ${statusFilter === 'on-leave' ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 shadow-md ring-2 ring-rose-500/20' : 'glass-card hover:border-rose-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">Home Leave</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block"><AnimatedNumber value={leaveCount} format={(v) => `${Math.round(v)}`} /></span>
          <span className="text-[10px] text-zinc-400">Away on approved leave</span>
        </motion.div>
      </Stagger>

      <Reveal>
        <DataTable
          columns={columns}
          data={filteredData}
          searchPlaceholder="Search student name or room number..."
          title={`Attendance Logs (${statusFilter.toUpperCase()})`}
        />
      </Reveal>
    </div>
  );
}
