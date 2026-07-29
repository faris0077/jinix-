'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/mock-data';
import { Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function WardenAttendancePage() {
  const { users } = useChavaraStore();
  const [selectedDate, setSelectedDate] = useState('2026-07-25');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'outpass' | 'on-leave' | 'library'>('all');

  const students = users.filter((u) => u.role === 'student');

  const filteredData = students.filter((s) => {
    if (statusFilter === 'all') return true;
    return (s.attendanceToday || 'present') === statusFilter;
  });

  const presentCount = students.filter((s) => (s.attendanceToday || 'present') === 'present').length;
  const outpassCount = students.filter((s) => s.attendanceToday === 'outpass').length;
  const leaveCount = students.filter((s) => s.attendanceToday === 'on-leave').length;
  const libraryCount = students.filter((s) => s.attendanceToday === 'library').length;

  const handleExportAttendance = () => {
    toast.success('Exporting Biometric Attendance Report...', {
      description: `Downloaded Block B attendance logs for ${selectedDate} as PDF/CSV.`,
    });
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Resident Scholar',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img src={row.original.avatar} alt={row.original.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/20" />
          <div>
            <p className="font-extrabold text-sm text-zinc-900 dark:text-white">{row.original.name}</p>
            <p className="text-[11px] text-zinc-400">ID: CHV-2024-{row.original.id.replace('user-', '')}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'roomNumber',
      header: 'Room',
      cell: ({ row }) => (
        <span className="font-bold text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-1 rounded">
          Room {row.original.roomNumber || '304A'}
        </span>
      ),
    },
    {
      accessorKey: 'attendanceToday',
      header: 'Biometric Gate Status',
      cell: ({ row }) => <StatusBadge status={row.original.attendanceToday || 'present'} />,
    },
    {
      id: 'lastSeen',
      header: 'Turnstile Check-In Timestamp',
      cell: ({ row }) => {
        const status = row.original.attendanceToday || 'present';
        if (status === 'present') return <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Inside Campus (08:15 PM)</span>;
        if (status === 'outpass') return <span className="text-xs text-amber-600 font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Checked out 14:30 PM (Lulu Mall)</span>;
        if (status === 'library') return <span className="text-xs text-purple-600 font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Library Turnstile (18:10 PM)</span>;
        return <span className="text-xs text-rose-500 font-semibold">On Home Leave</span>;
      },
    },
    {
      id: 'curfew',
      header: 'Curfew Compliance',
      cell: ({ row }) => {
        const status = row.original.attendanceToday || 'present';
        return status === 'outpass' ? (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200">
            Due by 08:30 PM
          </span>
        ) : (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
            Compliant
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-violet-600" />
            <span>Biometric Gate Attendance & Curfew Audit</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time synchronization with campus security turnstiles and facial recognition gate scanners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-sm"
          />
          <button
            onClick={handleExportAttendance}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit Report
          </button>
        </div>
      </div>

      {/* Tally Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('present')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'present' ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'glass-card hover:border-emerald-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Inside Campus</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block">{presentCount}</span>
          <span className="text-[10px] text-zinc-400">Checked in before curfew</span>
        </div>

        <div
          onClick={() => setStatusFilter('outpass')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'outpass' ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 shadow-md ring-2 ring-amber-500/20' : 'glass-card hover:border-amber-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">Active Outpass</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block">{outpassCount}</span>
          <span className="text-[10px] text-zinc-400">Currently in city / mall</span>
        </div>

        <div
          onClick={() => setStatusFilter('library')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'library' ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 shadow-md ring-2 ring-purple-500/20' : 'glass-card hover:border-purple-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">Digital Library Pass</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block">{libraryCount}</span>
          <span className="text-[10px] text-zinc-400">Central Tech Library</span>
        </div>

        <div
          onClick={() => setStatusFilter('on-leave')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'on-leave' ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 shadow-md ring-2 ring-rose-500/20' : 'glass-card hover:border-rose-500/40'}`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">Home / Vacation Leave</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1 block">{leaveCount}</span>
          <span className="text-[10px] text-zinc-400">Overnight out of station</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search student name or room number..."
        title={`Attendance Logs (${statusFilter.toUpperCase()})`}
      />
    </div>
  );
}
